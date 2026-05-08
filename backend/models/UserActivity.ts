import mongoose from 'mongoose';

const UserActivitySchema = new mongoose.Schema({
    clerkId: { type: String, required: true },
    joinedRooms: [{ 
        roomId: String, 
        language: String,
        joinedAt: { type: Date, default: Date.now } 
    }]
});

export const UserActivityModel = mongoose.model('UserActivity', UserActivitySchema);
