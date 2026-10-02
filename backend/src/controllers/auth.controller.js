import * as authService from '../services/auth.service.js';
import { successResponse } from '../utils/response.js';
import { toUserResponse } from '../dto/user-response.dto.js';
import { createUserDto } from '../dto/create-user.dto.js';

export const register = async (req, res) => {
  const dto = createUserDto(req.body);
  const user = await authService.register(dto);

  return successResponse(
    res,
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    'Usuario registrado',
    201
  );
};

export const login = async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);

  return successResponse(res, result, 'Inicio de sesión exitoso');
};

export const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);

  const userResponse = toUserResponse(user);

  return successResponse(res, userResponse, 'Usuario autenticado');
};
