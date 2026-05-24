import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import connectDB from './config/db';
import roomRoutes from './routes/roomRoutes';
import { setupYSocket } from './sockets/ySocket';
import { setupTerminalSocket } from './sockets/terminalSocket';

function loadEnv() {
    const envPath = join(dirname(fileURLToPath(import.meta.url)), '.env');
    try {
        const envData = readFileSync(envPath, 'utf8');
        envData.split(/\r?\n/).forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const [key, ...rest] = trimmed.split('=');
            const value = rest.join('=').trim();
            if (!key || value === undefined) return;
            if (process.env[key] === undefined) {
                process.env[key] = value;
            }
        });
    } catch {
        // .env file is optional
    }
}

loadEnv();

const app = express();
app.use(cors());
const frontendDistPath = existsSync(join(dirname(fileURLToPath(import.meta.url)), 'public', 'index.html'))
    ? join(dirname(fileURLToPath(import.meta.url)), 'public')
    : join(dirname(fileURLToPath(import.meta.url)), '../frontend/dist');

app.use(express.static(frontendDistPath));
app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api', roomRoutes);

// Catch-all route to serve the frontend for any unhandled routes (SPA)
app.use((req, res) => {
    res.sendFile(join(frontendDistPath, 'index.html'));
});
// Server Setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Socket Setup
setupYSocket(io);
setupTerminalSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
