import { createApiKeyForUser, getUserApiKeys, updateApiKeyStatus, recordApiKeyUsage } from '../services/apiKeyService.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const createApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, expiresInDays } = req.body;
    
    const { apiKey, expiresAt } = await createApiKeyForUser(userId, name, expiresInDays);
    
    successResponse(res, { apiKey, expiresAt }, 'API key created successfully.', 201);
  } catch (error) {
    errorResponse(res, error.message, 500);
  };
};

export const listApiKeys = async (req, res) => {
  try {
    const userId = req.user.id;
    const apiKeys = await getUserApiKeys(userId);
    
    successResponse(res, { apiKeys }, 'API keys retrieved successfully.');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

export const updateApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    const { isActive } = req.body;
    
    const affected = await updateApiKeyStatus(keyId, isActive);
    
    if (affected === 0) {
      return errorResponse(res, 'API key not found.', 404);
    }
    
    successResponse(res, null, 'API key status updated successfully.');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

export const testEndpoint = async (req, res) => {
  try {
    await recordApiKeyUsage(req.apiKey.id);
    
    successResponse(res, {
      message: 'Request successful.',
      apiKeyInfo: {
        id: req.apiKey.id,
        name: req.apiKey.name
      }
    }, 'API request successful.');
  } catch (error) {
    errorResponse(res, error.message, 500);
  };
};