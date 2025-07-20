// Mongoose user schema 
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    preferences: {
        betTypes: [String],
        sportsbooks: [String],
        lineChanges: [String],
    },
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  },
);

const User = mongoose.model('User', userSchema);

export default User;
