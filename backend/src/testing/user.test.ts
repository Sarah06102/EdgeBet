import request from 'supertest';
import app from '../server'
import mongoose from 'mongoose';

describe('User Routes', () => {
    it('should register a user', async () => {
        const res = await request(app)
        .post('/api/users/register')
        .send({ phoneNumber: '1234567890' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toHaveProperty('phoneNumber', '1234567890');
    });
    it('should sign in a user', async () => {
        const res = await request(app)
        .post('/api/users/signin')
        .send({ phoneNumber: '1234567890' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('userExists', true);
    });
    it('should verify a user', async () => {
        const res = await request(app)
        .post('/api/users/verify')
        .send({ phoneNumber: '1234567890' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toHaveProperty('isVerified', true);
    });
    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await mongoose.connection.close();
    });
});