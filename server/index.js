// Main App Imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { requestLogger } from './app/middlewares/loggerMiddleware.js';
import { errorResponse } from './utils/response.js';

// API Routes Imports
import { authRouter } from './routes/auth.routes.js';
import { apiKeyRouter } from './routes/apiKey.routes.js';

// Main App Configs
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Global App Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// System APIs
app.use('/api/auth', authRouter);
app.use('/api', apiKeyRouter);

// Global Error Handlers
app.use((req, res) => {
  errorResponse(res, 'Route not found', 404);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  errorResponse(res, 'Internal server error', 500);
});

// App Initialization
app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});