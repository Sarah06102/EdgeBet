"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.logoutUser = exports.updateUserProfile = exports.getUserProfile = exports.verifyCodeLogin = exports.verifyCodeRegister = exports.sendCodeLogin = exports.sendCodeRegister = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Twilio and JWT config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
const jwtSecret = process.env.JWT_SECRET;
// Safety check
if (!accountSid || !authToken || !verifySid || !jwtSecret) {
    console.error('Missing Twilio or JWT credentials in environment variables.');
}
const client = (0, twilio_1.default)(accountSid, authToken);
// Send code via Twilio and register user
const sendCodeRegister = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }
    try {
        const existingUser = await user_1.default.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists. Please log in instead.' });
        }
        const verification = await client.verify.v2.services(verifySid)
            .verifications.create({ to: phoneNumber, channel: 'sms' });
        res.status(200).json({ message: 'Code sent for registration', sid: verification.sid });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to send code', error: error.message || error });
    }
};
exports.sendCodeRegister = sendCodeRegister;
// Send code via Twilio and login user
const sendCodeLogin = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }
    try {
        const existingUser = await user_1.default.findOne({ phoneNumber });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }
        const verification = await client.verify.v2.services(verifySid)
            .verifications.create({ to: phoneNumber, channel: 'sms' });
        res.status(200).json({ message: 'Code sent for login', sid: verification.sid });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to send code', error: error.message || error });
    }
};
exports.sendCodeLogin = sendCodeLogin;
// Verify code and Register User
const verifyCodeRegister = async (req, res) => {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
        return res.status(400).json({ message: 'Phone number and code are required' });
    }
    try {
        const verification = await client.verify.v2.services(verifySid)
            .verificationChecks.create({ to: phoneNumber, code });
        if (verification.status !== 'approved') {
            return res.status(401).json({ message: 'Invalid code' });
        }
        const existingUser = await user_1.default.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(409).json({ message: 'User already registered with this phone number' });
        }
        const user = new user_1.default({ phoneNumber });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ phoneNumber: user.phoneNumber }, jwtSecret, { expiresIn: '7d' });
        res.status(200).json({ message: 'User registered successfully', token, user });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to verify code', error: err.message || err });
    }
};
exports.verifyCodeRegister = verifyCodeRegister;
// Verify code and Login user
const verifyCodeLogin = async (req, res) => {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
        return res.status(400).json({ message: 'Phone number and code are required' });
    }
    try {
        const verification = await client.verify.v2.services(verifySid)
            .verificationChecks.create({ to: phoneNumber, code });
        if (verification.status !== 'approved') {
            return res.status(401).json({ message: 'Invalid code' });
        }
        const existingUser = await user_1.default.findOne({ phoneNumber });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }
        const token = jsonwebtoken_1.default.sign({ phoneNumber: existingUser.phoneNumber }, jwtSecret, { expiresIn: '7d' });
        res.status(200).json({ message: 'Login successful', token, user: existingUser });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to verify code', error: err.message || err });
    }
};
exports.verifyCodeLogin = verifyCodeLogin;
// Get User Profile by Phone Number
const getUserProfile = async (req, res) => {
    const { phoneNumber } = req.params;
    try {
        const user = await user_1.default.findOne({ phoneNumber });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile', error: err.message || err });
    }
};
exports.getUserProfile = getUserProfile;
// Update User Profile
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
        user.preferences = {
            betTypes: preferences?.betTypes || [],
            sportsbooks: preferences?.sportsbooks || [],
            lineChanges: preferences?.lineChanges || []
        };
        await user.save();
        res.status(200).json({ message: 'Profile updated', user });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update profile', error: err.message || err });
    }
};
exports.updateUserProfile = updateUserProfile;
// Logout user
const logoutUser = async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logoutUser = logoutUser;
// Delete user account
const deleteUser = async (req, res) => {
    const phoneNumber = req.user?.phoneNumber;
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number missing in token' });
    }
    try {
        const user = await user_1.default.findOneAndDelete({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete account', error: err.message || err });
    }
};
exports.deleteUser = deleteUser;
