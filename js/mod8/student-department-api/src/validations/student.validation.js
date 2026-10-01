import Joi from "joi";

export const createStudentSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required(),

    age: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .required(),

    departmentId: Joi.number()
        .integer()
        .positive()
        .required()
});