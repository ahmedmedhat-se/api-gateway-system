import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const hashApiKey = async (apiKey) => {
  return await bcrypt.hash(apiKey, saltRounds);
};

export const compareApiKey = async (apiKey, hash) => {
  return await bcrypt.compare(apiKey, hash);
};

export const generateApiKey = async () => {
  const crypto = await import('crypto');
  return crypto.randomBytes(32).toString('hex');
};