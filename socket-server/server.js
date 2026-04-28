const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development, restrict in production
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Admin client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Admin client disconnected:', socket.id);
  });
});

// Endpoint for CI4 to hit when a new booking is created
app.post('/new-booking', (req, res) => {
  const bookingData = req.body;
  console.log('Received new booking:', bookingData);
  
  // Broadcast to all connected admin panels
  io.emit('new-booking', bookingData);
  
  res.status(200).json({ success: true, message: 'New booking broadcasted' });
});

// Endpoint for CI4 to hit when a booking status is updated
app.post('/booking-updated', (req, res) => {
  const updateData = req.body;
  console.log('Booking updated:', updateData);
  
  // Broadcast the update
  io.emit('booking-updated', updateData);
  
  res.status(200).json({ success: true, message: 'Booking update broadcasted' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket server is running on http://localhost:${PORT}`);
});
