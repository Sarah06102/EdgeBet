"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mock data to test since API may take too long to fetch and cause test to fail
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('Odds Routes', () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url: 'https://api.the-odds-api.com/v4/sports/americanfootball_nfl' },
            data: [
                { id: 'match1', teams: ['Team A', 'Team B'], sport_key: 'americanfootball_nfl' },
            ],
        });
    });
    it('should fetch matches for a valid sport', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/api/odds/matches?sport=americanfootball_nfl');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('sport_key', 'americanfootball_nfl');
    });
    it('should fallback to default sport if none is provided', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/api/odds/matches');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
