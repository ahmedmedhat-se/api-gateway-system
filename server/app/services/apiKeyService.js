import ApiKey from "../models/ApiKey.js";
import { generateApiKey, hashApiKey } from '../../utils/hash.js';

export const createApiKeyForUser = async (userId, name, expiresInDays = 30) => {
  const rawApiKey = await generateApiKey();
  const keyHash = await hashApiKey(rawApiKey);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  
  await ApiKey.create(userId, keyHash, name, expiresAt);
  
  return {
    apiKey: rawApiKey,
    expiresAt
  };
};

export const validateApiKey = async (apiKey) => {
  const keyHash = await hashApiKey(apiKey);
  const keyData = await ApiKey.findByKeyHash(keyHash);
  
  if (!keyData) {
    return { valid: false, error: 'Invalid API key' };
  }
  
  if (!keyData.is_active) {
    return { valid: false, error: 'API key is deactivated' };
  }
  
  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    return { valid: false, error: 'API key has expired' };
  }
  
  return { valid: true, keyData };
};

export const getUserApiKeys = async (userId) => {
  return await ApiKey.findByUser(userId);
};

export const updateApiKeyStatus = async (keyId, isActive) => {
  return await ApiKey.updateStatus(keyId, isActive);
};

export const recordApiKeyUsage = async (keyId) => {
  await ApiKey.updateLastUsed(keyId);
  await ApiKey.incrementUsageCount(keyId);
};