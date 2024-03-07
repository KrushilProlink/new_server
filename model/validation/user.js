const Joi = require("joi");

const validSignup = Joi.object({
    firstName: Joi.string().min(3).required("firstName"),
    lastName: Joi.string().required("lastName"),
    email: Joi.string().email().required("email"),
    phoneNumber: Joi.string().trim()
        .regex(/^[0-9]{10}$/)
        .message('Invalid mobile number format. Please enter a 10-digit number.')
        .required(),
});

const validSignin = Joi.object({
    phoneNumber: Joi.string().trim()
        .regex(/^[0-9]{10}$/)
        .message('Invalid mobile number format. Please enter a 10-digit number.')
        .required(),
});

module.exports = { validSignup, validSignin };