import { param } from 'express-validator';

export const uuidParamValidator = [
  param('id').isUUID().withMessage('Formato de ID inválido'),
];

export const uuidProjectIdParamValidator = [
  param('projectId').isUUID().withMessage('Formato de ID de proyecto inválido'),
];
