import { validateApiKey } from '../services/apiKeyService.js';
import { errorResponse } from '../../utils/response.js';

export const authenticate = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return errorResponse(res, 'API key is required.', 401);
    }

    const { valid, error, keyData } = await validateApiKey(apiKey);

    if (!valid) {
        return errorResponse(res, error, 401);
    };

    req.apiKey = keyData;
    next();
};