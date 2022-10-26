import Joi from 'joi';
import { emailExists, emailNotExists } from './email.schema';

export const register = Joi.object({
  fullName: Joi.string().required(),
  password: Joi.string().min(6).required(),
}).concat(emailNotExists);

export const login = Joi.object({
  password: Joi.string().min(6).required(),
}).concat(emailExists);

export const confirmToken = Joi.object({
  confirmToken: Joi.string().required(),
});

export const refreshToken = Joi.object({
  refreshToken: Joi.string().required(),
});
