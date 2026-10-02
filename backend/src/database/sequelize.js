import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';

let sequelize;

if (env.db.url) {
  const isNeon = env.db.url.includes('neon.tech') || env.db.url.includes('sslmode=require');
  sequelize = new Sequelize(env.db.url, {
    dialect: 'postgres',
    logging: false,
    ...(isNeon && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
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
