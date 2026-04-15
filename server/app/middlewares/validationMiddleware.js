import { validationResult } from 'express-validator';
import { errorResponse } from '../../utils/response.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    };
    
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    
    return errorResponse(res, 'Validation failed', 400, formattedErrors);
  };
};