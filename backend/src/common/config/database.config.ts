import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DATABASE_TYPE || 'mysql',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: process.env.DATABASE_PORT || 33061,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '1',
  database: process.env.DATABASE_NAME || 'nest-base',
  synchronize: true,
  logging: process.env.DATABASE_LOGGING === 'true' || false,
}));
