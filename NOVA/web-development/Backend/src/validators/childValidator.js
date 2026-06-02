import Joi from 'joi';
import InvariantError from '../exceptions/InvariantError.js';

const genderSchema = Joi.string().valid('male', 'female').required();

const createChildSchema = Joi.object({
  name: Joi.string().trim().required(),
  dateOfBirth: Joi.date().iso().required(),
  gender: genderSchema,
});

const updateChildSchema = Joi.object({
  name: Joi.string().trim(),
  dateOfBirth: Joi.date().iso(),
  gender: Joi.string().valid('male', 'female'),
}).min(1);

const measurementSchema = Joi.object({
  heightCm: Joi.number().positive().required(),
  weightKg: Joi.number().positive().required(),
  measuredOn: Joi.date().iso().required(),
});

const assessSchema = Joi.object({
  measurementId: Joi.number().integer().positive(),
});

const validate = (schema, payload) => {
  const { error } = schema.validate(payload, { abortEarly: false });
  if (error) {
    throw new InvariantError(error.details[0].message);
  }
};

export const validateCreateChild = (payload) => validate(createChildSchema, payload);
export const validateUpdateChild = (payload) => validate(updateChildSchema, payload);
export const validateMeasurement = (payload) => validate(measurementSchema, payload);
export const validateAssess = (payload) => validate(assessSchema, payload);