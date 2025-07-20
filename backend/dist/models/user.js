"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mongoose user schema 
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
