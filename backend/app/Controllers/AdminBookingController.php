<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

/**
 * AdminBookingController
 * Handles all backend booking management operations for the admin dashboard with RBAC.
 */
class AdminBookingController extends ResourceController
{
    use ResponseTrait;

    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        
        // Ensure CORS headers are sent
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    }

    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    /**
     * GET /admin/bookings
     * Returns bookings filtered by role.
     */
    public function index()
    {
        try {
            $role = session()->get('role') ?? 'admin'; // Fallback for dev without session active
            // Frontend might send role via query param during dev if session is not hooked up
            $role = $this->request->getGet('role') ?? $role;
            $search = $this->request->getGet('search') ?? '';

            $builder = $this->db->table('bookings');
            if (!empty($search)) {
                $builder->groupStart()
                        ->like('guest_name', $search)
                        ->orLike('mobile', $search)
                        ->groupEnd();
            }
            $query = $builder->orderBy('created_at', 'DESC')->get();
            $bookings = $query->getResultArray();

            $filteredBookings = [];

            foreach ($bookings as $booking) {
                // Ensure total_guests is calculated
                $total_guests = ($booking['adults'] ?? 0) + ($booking['kids'] ?? 0);
                $booking['total_guests'] = $total_guests;

                if ($role === 'guest_manager') {
                    // Limited View for Guest Manager
                    $filteredBookings[] = [
                        'id' => $booking['id'],
                        'guest_name' => $booking['guest_name'],
                        'total_guests' => $total_guests,
                        'category' => $booking['category'],
                        'checkin_date' => $booking['checkin_date'],
                        'checkout_date' => $booking['checkout_date']
                    ];
                } else if ($role === 'reservation_manager') {
                    // Full view except maybe no delete flags
                    $filteredBookings[] = $booking;
                } else {
                    // Admin gets everything
                    $filteredBookings[] = $booking;
                }
            }

            return $this->respond($filteredBookings);
        } catch (\Exception $e) {
            return $this->failServerError('Failed to fetch bookings: ' . $e->getMessage());
        }
    }

    /**
     * GET /admin/bookings/guest-checkins
     * Returns all guest check-in submissions.
     */
    public function guestCheckins()
    {
        $role = $this->request->getGet('role') ?? session()->get('role') ?? 'admin';
        if ($role === 'guest_manager') {
            return $this->failForbidden('Guest Managers cannot view full check-in data.');
        }

        $search = $this->request->getGet('search') ?? '';

        try {
            $builder = $this->db->table('guest_checkins');

            if (!empty($search)) {
                $builder->groupStart()
                        ->like('name', $search)
                        ->orLike('phone', $search)
                        ->orLike('location', $search)
                        ->groupEnd();
            }

            $query = $builder->orderBy('created_at', 'DESC')->get();
            return $this->respond($query->getResultArray());
        } catch (\Exception $e) {
            return $this->failServerError('Failed to fetch guest check-ins: ' . $e->getMessage());
        }
    }

    public function show($id = null)
    {
        try {
            $booking = $this->db->table('bookings')->where('id', $id)->get()->getRowArray();
            if (!$booking) return $this->failNotFound('Booking not found');
            return $this->respond($booking);
        } catch (\Exception $e) {
            return $this->failServerError('Failed to fetch booking details');
        }
    }

    /**
     * POST /admin/bookings/update-status/(:num)
     * Allowed: admin, reservation_manager
     */
    public function updateStatus($id = null)
    {
        $role = $this->request->getPost('role') ?? session()->get('role') ?? 'admin';
        if ($role === 'guest_manager') {
            return $this->failForbidden('Guest Managers cannot update booking status.');
        }

        try {
            $input = $this->request->getJSON();
            $status = $input->status ?? null;

            if (!in_array($status, ['pending', 'confirmed', 'cancelled'])) {
                return $this->failValidationError('Invalid status provided');
            }

            $bookingExists = $this->db->table('bookings')->where('id', $id)->countAllResults();
            if ($bookingExists === 0) return $this->failNotFound('Booking not found');

            $this->db->table('bookings')->where('id', $id)->update(['status' => $status]);

            // Broadcast to Socket.IO Server
            $this->broadcastEvent('booking-updated', [
                'id' => $id,
                'status' => $status
            ]);

            return $this->respondUpdated(['message' => 'Status updated successfully', 'status' => $status]);
        } catch (\Exception $e) {
            return $this->failServerError('Failed to update booking status');
        }
    }

    /**
     * POST /admin/bookings/update-dates/(:num)
     * Allowed: admin, reservation_manager, guest_manager
     */
    public function updateDates($id = null)
    {
        try {
            $input = $this->request->getJSON();
            $checkin = $input->checkin_date ?? null;
            $checkout = $input->checkout_date ?? null;

            if (!$checkin || !$checkout) {
                return $this->failValidationError('Check-in and Check-out dates are required.');
            }

            $bookingExists = $this->db->table('bookings')->where('id', $id)->countAllResults();
            if ($bookingExists === 0) return $this->failNotFound('Booking not found');

            $this->db->table('bookings')->where('id', $id)->update([
                'checkin_date' => $checkin,
                'checkout_date' => $checkout
            ]);

            // Broadcast to Socket.IO Server
            $this->broadcastEvent('booking-updated', [
                'id' => $id,
                'checkin_date' => $checkin,
                'checkout_date' => $checkout
            ]);

            return $this->respondUpdated(['message' => 'Dates updated successfully']);
        } catch (\Exception $e) {
            return $this->failServerError('Failed to update booking dates');
        }
    }

    /**
     * POST /admin/bookings/delete/(:num)
     * Allowed: admin ONLY
     */
    public function delete($id = null)
    {
        $role = $this->request->getPost('role') ?? session()->get('role') ?? 'admin';
        if ($role !== 'admin') {
            return $this->failForbidden('Only Main Admins can delete bookings.');
        }

        try {
            $bookingExists = $this->db->table('bookings')->where('id', $id)->countAllResults();
            if ($bookingExists === 0) return $this->failNotFound('Booking not found');

            $this->db->table('bookings')->where('id', $id)->delete();

            return $this->respondDeleted(['message' => 'Booking deleted successfully', 'id' => $id]);
        } catch (\Exception $e) {
            return $this->failServerError('Failed to delete booking');
        }
    }

    private function broadcastEvent($endpoint, $data)
    {
        try {
            $ch = curl_init("http://localhost:3000/{$endpoint}");
            $payload = json_encode($data);
            
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($payload)
            ]);
            
            $result = curl_exec($ch);
            curl_close($ch);
            
            return $result;
        } catch (\Exception $e) {
            return false;
        }
    }
}
