import { Router } from 'express';

import * as taskController from '../controllers/task.controller.js';
import {
  createTaskValidator,
  updateTaskValidator,
  bodyIdValidator,
} from '../validators/task.validator.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uuidParamValidator, uuidProjectIdParamValidator } from '../validators/common.validator.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Obtener todas las tareas del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get('/', authenticate, taskController.getAllTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Crear una nueva tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarea creada
 */
router.post(
  '/',
  authenticate,
  createTaskValidator,
  validate,
  taskController.createTask
);

router.post(
  '/:projectId',
  authenticate,
  uuidProjectIdParamValidator,
  validate,
  createTaskValidator,
  validate,
  taskController.createTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Obtener una tarea por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *       404:
 *         description: Tarea no encontrada
 */
router.get(
  '/:id',
  authenticate,
  uuidParamValidator,
  validate,
  taskController.getTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Actualizar una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */
router.put(
  '/:id',
  authenticate,
  uuidParamValidator,
  updateTaskValidator,
  validate,
  taskController.updateTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Eliminar una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tarea eliminada
 */
router.delete(
  '/:id',
  authenticate,
  uuidParamValidator,
  validate,
  taskController.deleteTask
);

/**
 * @swagger
 * /tasks/{id}/complete:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Marcar una tarea como completada
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tarea marcada como completada
 *       404:
 *         description: Tarea no encontrada
 */
router.patch(
  '/:id/complete',
  authenticate,
  uuidParamValidator,
  validate,
  taskController.completeTask
);

router.patch(
  '/:id',
  authenticate,
  uuidParamValidator,
  validate,
  updateTaskValidator,
  validate,
  taskController.updateTask
);

export default router;
