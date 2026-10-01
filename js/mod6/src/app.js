import express from 'express';
import cors from 'cors';

import studentRoutes from './routes/student.routes.js';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Student API is running'
    });
});

// Student routes
app.use('/api/students', studentRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;