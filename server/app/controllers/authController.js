import User from '../models/User.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return errorResponse(res, 'User already exists', 409);
        };

        const passwordHash = await hashPassword(password);
        const userId = await User.create(email, passwordHash);

        const user = await User.findById(userId);

        successResponse(res, { user }, 'User registered successfully', 201);
    } catch (error) {
        errorResponse(res, error.message, 500);
    };
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        };

        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            return errorResponse(res, 'Invalid credentials', 401);
        };

        const userData = {
            id: user.id,
            email: user.email,
            created_at: user.created_at
        };

        successResponse(res, { user: userData }, 'Login successful');
    } catch (error) {
        errorResponse(res, error.message, 500);
    };
};