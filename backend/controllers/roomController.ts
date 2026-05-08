import { Request, Response } from 'express';
import { RoomModel } from '../models/Room';
import { UserActivityModel } from '../models/UserActivity';

export const joinRoom = async (req: Request, res: Response) => {
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
};

export const getUserHistory = async (req: Request, res: Response) => {
    try {
        const activity = await UserActivityModel.findOne({ clerkId: req.params.clerkId });
        res.json(activity?.joinedRooms || []);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
};
