import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        errorMessage: 'Email is required',
        notEmpty: true,
        trim: true,
    },
    firstName: {
        errorMessage: 'First name is required',
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: 'Last name is required',
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: 'Password is required',
        notEmpty: true,
        trim: true,
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long',
        },
    },
});

// export default [body("email").notEmpty().withMessage("Email is required")];
