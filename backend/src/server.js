import app from './app.js';

import { env } from './config/env.js';
import sequelize from './database/sequelize.js';
import logger from './config/logger.js';

// Entities
import './entities/index.js';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });
    // await sequeliz e.sync({ alter: true });
    logger.info('Models synchronized');

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (error) {
    logger.error(' Error starting server');
    logger.error(error);
    process.exit(1);
  }
};

startServer();
