import mongoose from 'mongoose';

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    const uri = MONGO_URI || "mongodb://localhost:27017/collab-edit";

    if (!MONGO_URI) {
        console.warn("⚠️ MONGO_URI is not set. Using fallback:", uri);
        console.warn("   If the backend runs inside Docker on Windows, use host.docker.internal instead of localhost.");
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err?.message || err, "\nMONGO_URI:", uri);
        process.exit(1);
    }
};

export default connectDB;
