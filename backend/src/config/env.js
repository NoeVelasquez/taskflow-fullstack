import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV,

  db: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://neondb_owner:npg_al0KOtnorv8k@ep-aged-waterfall-b82ydsqh-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_jwt_key_taskflow_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
