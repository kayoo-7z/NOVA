import Joi from 'joi';
import InvariantError from '../exceptions/InvariantError.js';

const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

const validate = (schema, payload) => {
  const { error } = schema.validate(payload, {
    abortEarly: false,
  });

  if (error) {
    throw new InvariantError(error.details[0].message);
  }
};

export const validateRegisterPayload = (payload) => {
  validate(registerSchema, payload);
};

export const validateLoginPayload = (payload) => {
  validate(loginSchema, payload);
};