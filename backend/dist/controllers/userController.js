"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirebaseToken = exports.updateUserProfile = exports.getUserProfile = exports.registerOrLoginUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const firebaseAdmin_1 = __importDefault(require("../config/firebaseAdmin"));
const registerOrLoginUser = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
    }
    try {
        const decodedToken = await firebaseAdmin_1.default.auth().verifyIdToken(idToken);
        const { uid, phone_number } = decodedToken;
        if (!phone_number) {
            return res.status(400).json({ message: 'Phone number missing in token' });
        }
        let user = await user_1.default.findOne({ uid });
        if (!user) {
            user = new user_1.default({
                uid,
                phoneNumber: phone_number,
                isVerified: true,
            });
            await user.save();
        }
        res.status(200).json({ message: 'User authenticated', user });
    }
    catch (err) {
        console.error('Firebase auth error:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.registerOrLoginUser = registerOrLoginUser;
// Get user profile by phone number
const getUserProfile = async (req, res) => {
    const { phoneNumber } = req.params;
    try {
        const user = await user_1.default.findOne({ phoneNumber });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    }
    catch (err) {
        console.error('Fetch profile error:', err);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};
exports.getUserProfile = getUserProfile;
// Update user profile
const updateUserProfile = async (req, res) => {
    const { phoneNumber, firstName, lastName, email, preferences } = req.body;
    try {
        const user = await user_1.default.findOne({ phoneNumber });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (email)
            user.email = email;
        if (!user.preferences) {
            user.preferences = {
                betTypes: [],
                sportsbooks: [],
                lineChanges: [],
            };
        }
        if (preferences?.betTypes)
            user.preferences.betTypes = preferences.betTypes;
        if (preferences?.sportsbooks)
            user.preferences.sportsbooks = preferences.sportsbooks;
        if (preferences?.lineChanges)
            user.preferences.lineChanges = preferences.lineChanges;
        await user.save();
        res.status(200).json({ message: 'Profile updated', user });
    }
    catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
exports.updateUserProfile = updateUserProfile;
const verifyFirebaseToken = async (req, res) => {
    const { idToken } = req.body;
    try {
        const decodedToken = await firebaseAdmin_1.default.auth().verifyIdToken(idToken);
        const { phone_number } = decodedToken;
        let user = await user_1.default.findOne({ phoneNumber: phone_number });
        if (!user) {
            user = new user_1.default({ phoneNumber: phone_number });
            await user.save();
        }
        return res.status(200).json({ message: 'Authenticated', user });
    }
    catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.verifyFirebaseToken = verifyFirebaseToken;
