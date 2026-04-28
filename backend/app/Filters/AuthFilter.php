<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class AuthFilter implements FilterInterface
{
    /**
     * Do whatever processing this filter needs to do.
     * By default it should not return anything during
     * normal execution. However, when an abnormal state
     * is found, it should return an instance of
     * CodeIgniter\HTTP\Response. If it does, script
     * execution will end and that Response will be
     * sent back to the client, allowing for error pages,
     * redirects, etc.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments Allowed roles for the endpoint
     *
     * @return mixed
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        $session = session();
        
        // Block access if not logged in
        if (!$session->get('is_logged_in')) {
            // Check if it's an API request
            if ($request->isAJAX() || strpos($request->getPath(), 'api/') !== false || strpos($request->getPath(), 'admin/bookings') !== false) {
                return \Config\Services::response()
                    ->setJSON(['error' => 'Unauthorized access'])
                    ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
            }
            return redirect()->to('/login');
        }

        // Check role permissions if roles are passed to the filter
        if ($arguments) {
            $userRole = $session->get('role');
            if (!in_array($userRole, $arguments)) {
                if ($request->isAJAX() || strpos($request->getPath(), 'api/') !== false || strpos($request->getPath(), 'admin/bookings') !== false) {
                    return \Config\Services::response()
                        ->setJSON(['error' => 'Forbidden: Insufficient role permissions'])
                        ->setStatusCode(ResponseInterface::HTTP_FORBIDDEN);
                }
                return redirect()->to('/unauthorized');
            }
        }
    }

    /**
     * Allows After filters to inspect and modify the response
     * object as needed. This method does not allow any way
     * to stop execution of other after filters, short of
     * throwing an Exception or Error.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return mixed
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing here
    }
}
