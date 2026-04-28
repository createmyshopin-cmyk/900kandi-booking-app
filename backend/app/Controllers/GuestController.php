<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

/**
 * GuestController
 * Handles public-facing endpoints like guest check-in
 */
class GuestController extends ResourceController
{
    use ResponseTrait;

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

    /**
     * POST /guest-checkin
     */
    public function checkin()
    {
        try {
            $input = $this->request->getJSON(true) ?? $this->request->getPost();
            
            // Validate all required fields
            if (empty($input['name']) || empty($input['phone']) || empty($input['location']) || empty($input['instagram']) || empty($input['profession'])) {
                return $this->failValidationError('All fields (Name, Phone, Location, Instagram, Profession) are required.');
            }

            // Sanitize inputs
            $booking_id = !empty($input['booking_id']) ? intval($input['booking_id']) : null;
            $name = htmlspecialchars(strip_tags($input['name']));
            $phone = htmlspecialchars(strip_tags($input['phone']));
            $location = !empty($input['location']) ? htmlspecialchars(strip_tags($input['location'])) : null;
            $instagram = !empty($input['instagram']) ? htmlspecialchars(strip_tags($input['instagram'])) : null;
            $profession = !empty($input['profession']) ? htmlspecialchars(strip_tags($input['profession'])) : null;

            // Insert into guest_checkins table
            $data = [
                'booking_id' => $booking_id,
                'name' => $name,
                'phone' => $phone,
                'location' => $location,
                'instagram' => $instagram,
                'profession' => $profession
            ];

            $this->db->table('guest_checkins')->insert($data);

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Check-in completed successfully. Enjoy your stay!'
            ]);
        } catch (\Exception $e) {
            return $this->failServerError('An error occurred during check-in: ' . $e->getMessage());
        }
    }
}
