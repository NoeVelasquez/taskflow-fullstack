import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';

let sequelize;

if (env.db.url) {
  // Sequelize v6 requiere 'postgres://' en lugar de 'postgresql://'
  const normalizedUrl = env.db.url.replace(/^postgresql:\/\//i, 'postgres://');
  const isNeon = normalizedUrl.includes('neon.tech') || normalizedUrl.includes('sslmode=require');

  sequelize = new Sequelize(normalizedUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ...(isNeon || env.nodeEnv === 'production'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {}),
    },
  });
} else {
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    username: env.db.username,
    password: env.db.password,
    logging: false,
    ...(env.nodeEnv === 'production' && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
  });
}

export default sequelize;
