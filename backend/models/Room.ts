import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    content: { type: Buffer }, 
    language: { type: String, default: 'typescript' },
    lastUpdated: { type: Date, default: Date.now }
});

export const RoomModel = mongoose.model('Room', RoomSchema);
