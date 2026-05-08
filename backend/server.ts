import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db';
import roomRoutes from './routes/roomRoutes';
import { setupYSocket } from './sockets/ySocket';

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api', roomRoutes);

// Server Setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Socket Setup
setupYSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
