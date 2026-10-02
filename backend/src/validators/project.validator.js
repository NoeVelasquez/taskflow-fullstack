import { body } from 'express-validator';

export const createProjectValidator = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 255 })
    .withMessage('El nombre debe tener menos de 255 caracteres'),

  body('description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser un texto'),
];
