import express from 'express';
import { createApiKey, listApiKeys, updateApiKey, testEndpoint } from '../app/controllers/apiKeyController.js';
import { authenticate } from '../app/middlewares/authMiddleware.js';
import { rateLimiter } from '../app/middlewares/rateLimiterMiddleware.js';
import { validate } from '../app/middlewares/validationMiddleware.js';
import { createApiKeyValidation, updateApiKeyStatusValidation } from '../app/validations/apiKey.js';

export const apiKeyRouter = express.Router();

apiKeyRouter.use(authenticate);
apiKeyRouter.use(rateLimiter);

apiKeyRouter.post('/keys', validate(createApiKeyValidation), createApiKey);
apiKeyRouter.get('/keys', listApiKeys);
apiKeyRouter.patch('/keys/:keyId', validate(updateApiKeyStatusValidation), updateApiKey);
apiKeyRouter.get('/test', testEndpoint);