import { body } from 'express-validator';

export const createApiKeyValidation = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters.'),
    
  body('expiresInDays')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Expiration must be between 1 and 365 days.')
];

export const updateApiKeyStatusValidation = [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value.')
];