import { registerAs } from '@nestjs/config';

export default registerAs('redis', async () => ({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: +process.env.REDIS_PORT || 6379,
}));

export interface IRedis {
  host: string;
  port: number;
}
