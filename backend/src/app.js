import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import routes from './routes/index.routes.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

// Soporte tanto para prefijo /api como para rutas en la raíz
app.use('/api', routes);
app.use(routes);

// Manejador para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Siempre al final
app.use(errorHandler);

export default app;
