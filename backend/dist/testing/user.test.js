"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
describe('User Routes', () => {
    it('should register a user', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/users/register')
            .send({ phoneNumber: '1234567890' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toHaveProperty('phoneNumber', '1234567890');
    });
    it('should sign in a user', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/users/signin')
            .send({ phoneNumber: '1234567890' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('userExists', true);
    });
    it('should verify a user', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/users/verify')
            .send({ phoneNumber: '1234567890' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toHaveProperty('isVerified', true);
    });
    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await mongoose_1.default.connection.close();
    });
});
