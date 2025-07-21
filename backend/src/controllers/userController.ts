import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Twilio and JWT config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
const jwtSecret = process.env.JWT_SECRET!;

// Safety check
if (!accountSid || !authToken || !verifySid || !jwtSecret) {
  console.error('Missing Twilio or JWT credentials in environment variables.');
}

const client = twilio(accountSid, authToken);

// Send code via Twilio and register user
export const sendCodeRegister = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists. Please log in instead.' });
    }

    const verification = await client.verify.v2.services(verifySid!)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    res.status(200).json({ message: 'Code sent for registration', sid: verification.sid });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send code', error: error.message || error });
  }
};

// Send code via Twilio and login user
export const sendCodeLogin = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    const verification = await client.verify.v2.services(verifySid!)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    res.status(200).json({ message: 'Code sent for login', sid: verification.sid });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send code', error: error.message || error });
  }
};

// Verify code and Register User
export const verifyCodeRegister = async (req: Request, res: Response) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({ message: 'Phone number and code are required' });
  }

  try {
    const verification = await client.verify.v2.services(verifySid!)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verification.status !== 'approved') {
      return res.status(401).json({ message: 'Invalid code' });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ message: 'User already registered with this phone number' });
    }

    const user = new User({ phoneNumber });
    await user.save();

    const token = jwt.sign({ phoneNumber: user.phoneNumber }, jwtSecret, { expiresIn: '7d' });
    res.status(200).json({ message: 'User registered successfully', token, user });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to verify code', error: err.message || err });
  }
};

// Verify code and Login user
export const verifyCodeLogin = async (req: Request, res: Response) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({ message: 'Phone number and code are required' });
  }

  try {
    const verification = await client.verify.v2.services(verifySid!)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verification.status !== 'approved') {
      return res.status(401).json({ message: 'Invalid code' });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    const token = jwt.sign({ phoneNumber: existingUser.phoneNumber }, jwtSecret, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token, user: existingUser });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to verify code', error: err.message || err });
  }
};

// Get User Profile by Phone Number
export const getUserProfile = async (req: Request, res: Response) => {
  const { phoneNumber } = req.params;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message || err });
  }
};

// Update User Profile
export const updateUserProfile = async (req: Request, res: Response) => {
  const { phoneNumber, firstName, lastName, email, preferences } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    user.preferences = {
      betTypes: preferences?.betTypes || [],
      sportsbooks: preferences?.sportsbooks || [],
      lineChanges: preferences?.lineChanges || []
    };

    await user.save();
    res.status(200).json({ message: 'Profile updated', user });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message || err });
  }
};

// Logout user
export const logoutUser = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// Delete user account
export const deleteUser = async (req: Request, res: Response) => {
  const phoneNumber = (req as any).user?.phoneNumber;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number missing in token' });
  }

  try {
    const user = await User.findOneAndDelete({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete account', error: err.message || err });
  }
};

