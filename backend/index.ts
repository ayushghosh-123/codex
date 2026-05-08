import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import mongoose from 'mongoose';
import cors from 'cors';
import * as Y from 'yjs';

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/collab-edit";
mongoose.connect(MONGO_URI).then(() => console.log("✅ Connected to MongoDB"));

// --- DATABASE MODELS ---
const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    content: { type: Buffer }, 
    language: { type: String, default: 'typescript' },
    lastUpdated: { type: Date, default: Date.now }
});

const UserActivitySchema = new mongoose.Schema({
    clerkId: { type: String, required: true },
    joinedRooms: [{ 
        roomId: String, 
        language: String,
        joinedAt: { type: Date, default: Date.now } 
    }]
});

const RoomModel = mongoose.model('Room', RoomSchema);
const UserActivityModel = mongoose.model('UserActivity', UserActivitySchema);

// --- SERVER SETUP ---
const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const ysocketIo = new YSocketIO(io);

ysocketIo.on('document-loaded', async (doc: Y.Doc, roomName: string) => {
    const room = await RoomModel.findOne({ roomId: roomName });
    if (room?.content) {
        Y.applyUpdate(doc, room.content);
    }

    doc.on('update', async () => {
        const state = Y.encodeStateAsUpdate(doc);
        await RoomModel.findOneAndUpdate(
            { roomId: roomName },
            { content: Buffer.from(state), lastUpdated: new Date() },
            { upsert: true }
        );
    });
});

ysocketIo.initialize();

// --- API ROUTES ---
app.post('/api/rooms/join', async (req: Request, res: Response) => {
    const { clerkId, roomId, language } = req.body;
    try {
        // Remove existing entry for this room to keep history unique
        await UserActivityModel.findOneAndUpdate(
            { clerkId },
            { $pull: { joinedRooms: { roomId: roomId } } }
        );

        // Add the room as a fresh entry
        await UserActivityModel.findOneAndUpdate(
            { clerkId },
            { $push: { joinedRooms: { roomId, language, joinedAt: new Date() } } },
            { upsert: true }
        );

        // Also update room language if it doesn't exist
        await RoomModel.findOneAndUpdate(
            { roomId },
            { language },
            { upsert: true }
        );
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to save activity" });
    }
});

app.get('/api/user-history/:clerkId', async (req: Request, res: Response) => {
    try {
        const activity = await UserActivityModel.findOne({ clerkId: req.params.clerkId });
        res.json(activity?.joinedRooms || []);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

httpServer.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
