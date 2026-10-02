import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import logger from '../config/logger.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Se requiere token de autorización',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);

    req.user = decoded;

    next();
  } catch (error) {
    logger.info(error);
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
};
