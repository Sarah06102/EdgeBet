// Initialize express
// Connect to db
// Load middleware
// Mount user routes
// Start server
import connectDB from './config/db';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/userRoutes';
import { notFound, errorHandler } from './middleware/errorHandler';
import oddsRoutes from './routes/oddsRoutes';

// Connect to MongoDB
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/users', router);
app.use('/api/odds', oddsRoutes);

// Global error handlers
app.use(notFound);
app.use(errorHandler);

export default app;


