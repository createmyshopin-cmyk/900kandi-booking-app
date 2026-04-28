<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class BookingController extends ResourceController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        
        // CORS Configuration
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    }

    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function create()
    {
        try {
            $input = $this->request->getJSON(true) ?? $this->request->getPost();
            
            // Insert into database
            $data = [
                'guest_name' => $input['guest_name'] ?? 'Unknown',
                'mobile' => $input['mobile'] ?? '',
                'checkin_date' => $input['checkin_date'] ?? date('Y-m-d'),
                'checkout_date' => $input['checkout_date'] ?? date('Y-m-d', strtotime('+1 day')),
                'adults' => $input['adults'] ?? 1,
                'kids' => $input['kids'] ?? 0,
                'category' => isset($input['category']) ? json_encode($input['category']) : '[]',
                'total_amount' => $input['total_amount'] ?? 0,
                'status' => 'pending'
            ];

            $this->db->table('bookings')->insert($data);
            $data['id'] = $this->db->insertID();

            // Broadcast to Socket.IO Server
            $this->broadcastEvent('new-booking', $data);

            return $this->respondCreated(['success' => true, 'message' => 'Booking created successfully', 'data' => $data]);
        } catch (\Exception $e) {
            return $this->failServerError('Failed to create booking: ' . $e->getMessage());
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
            // Silently fail if socket server is down
            return false;
        }
    }
}
