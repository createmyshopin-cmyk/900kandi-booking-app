CREATE DATABASE IF NOT EXISTS luxestay_db;
USE luxestay_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','reservation_manager','guest_manager') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    adults INT DEFAULT 1,
    kids INT DEFAULT 0,
    category JSON NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dummy Users (Passwords are 'password' hashed with BCRYPT)
INSERT INTO users (name, email, password, role) VALUES
('Super Admin', 'admin@luxestay.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Res Manager', 'manager@luxestay.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'reservation_manager'),
('Guest Host', 'guest@luxestay.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'guest_manager');

-- Dummy Data for initial testing
INSERT INTO bookings (guest_name, mobile, checkin_date, checkout_date, adults, kids, category, total_amount, status) VALUES
('John Doe', '9876543210', '2026-05-10', '2026-05-15', 2, 0, '["Premium A Frame"]', 27500.00, 'confirmed'),
('Jane Smith', '9123456780', '2026-06-01', '2026-06-03', 4, 2, '["Room Stay"]', 4000.00, 'pending'),
('Michael Johnson', '9988776655', '2026-05-20', '2026-05-22', 2, 1, '["Tent Stay"]', 7200.00, 'cancelled');

CREATE TABLE IF NOT EXISTS guest_checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    instagram VARCHAR(255),
    profession VARCHAR(255),
    id_proof VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
