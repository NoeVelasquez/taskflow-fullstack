import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { createProjectValidator } from '../validators/project.validator.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uuidParamValidator, uuidProjectIdParamValidator } from '../validators/common.validator.js';
import taskRoutes from './task.routes.js';

const router = Router();

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Obtener un proyecto con sus tareas
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
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get(
  '/:id',
  authenticate,
  uuidParamValidator,
  validate,
  projectController.getProjectWithTasks
);

/**
 * @swagger
 * /projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Crear un nuevo proyecto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado
 */
router.post(
  '/',
  authenticate,
  createProjectValidator,
  validate,
  projectController.createProject
);

router.get(
  '/',
  authenticate,
  projectController.getAllProjects
);

router.put(
  '/:id',
  authenticate,
  uuidParamValidator,
  validate,
  projectController.updateProject
);

router.delete(
  '/:id',
  authenticate,
  uuidParamValidator,
  validate,
  projectController.deleteProject
);

// Rutas anidadas para tareas del proyecto
router.use('/:projectId/tasks', uuidProjectIdParamValidator, validate, taskRoutes);

export default router;
