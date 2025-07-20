// Logic for the user routes
import { Request, Response } from 'express';
import User from '../models/user';
import admin from '../config/firebaseAdmin';
import twilio from 'twilio';

export const registerOrLoginUser = async (req: Request, res: Response) => {
    const { idToken } = req.body;
  
    if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
    }
  
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, phone_number } = decodedToken;
  
        if (!phone_number) {
            return res.status(400).json({ message: 'Phone number missing in token' });
        }
  
        let user = await User.findOne({ uid });
  
        if (!user) {
            user = new User({
                uid,
                phoneNumber: phone_number,
                isVerified: true,
            });
            await user.save();
        }
        res.status(200).json({ message: 'User authenticated', user });
    } catch (err) {
        console.error('Firebase auth error:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
  
// Get user profile by phone number
export const getUserProfile = async (req: Request, res: Response) => {
    const { phoneNumber } = req.params;
  
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        res.status(200).json(user);
    } catch (err) {
        console.error('Fetch profile error:', err);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};
  
// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
    const { phoneNumber, firstName, lastName, email, preferences } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

        if (!user.preferences) {
            user.preferences = {
                betTypes: [],
                sportsbooks: [],
                lineChanges: [],
            };
        }
        if (preferences?.betTypes) user.preferences.betTypes = preferences.betTypes;
        if (preferences?.sportsbooks) user.preferences.sportsbooks = preferences.sportsbooks;
        if (preferences?.lineChanges) user.preferences.lineChanges = preferences.lineChanges;

        await user.save();

        res.status(200).json({ message: 'Profile updated', user });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};


export const verifyFirebaseToken = async (req: Request, res: Response) => {
    const { idToken } = req.body;
  
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { phone_number } = decodedToken;
  
        let user = await User.findOne({ phoneNumber: phone_number });
        if (!user) {
            user = new User({ phoneNumber: phone_number });
            await user.save();
        }
        return res.status(200).json({ message: 'Authenticated', user });
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };