import express from 'express';
import { register, login } from '../app/controllers/authController.js';
import { validate } from '../app/middlewares/validationMiddleware.js';
import { registerValidation, loginValidation } from '../app/validations/auth.js';

export const authRouter = express.Router();

authRouter.post('/register', validate(registerValidation), register);
authRouter.post('/login', validate(loginValidation), login);

export default authRouter;