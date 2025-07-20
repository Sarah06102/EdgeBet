// Connect MongoDB
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI || '');
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};

export default connectDB;