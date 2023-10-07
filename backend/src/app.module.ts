import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './common/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { IRedis } from './common/config/redis.config';
import { UserModule } from './user/user.module';
import { EntitesModule } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configuration,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (c: ConfigService) => {
        const configDatabase = c.get<TypeOrmModuleOptions>('database');
        return {
          ...configDatabase,
          autoLoadEntities: true,
          entities: [join(__dirname, '**/**.entity{.ts,.js}')],
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<any>({
      imports: [ConfigModule],
      useFactory: async (c: ConfigService) => {
        const cacheConfig = c.get<IRedis>('redis');
        const storeConfig: any = {
          socket: {
            host: cacheConfig.host,
            port: cacheConfig.port,
          },
        };
        const store = await redisStore(storeConfig);
        return {
          store,
        };
      },
      isGlobal: true,
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (c: ConfigService) => {
        return {
          name: 'worker',
          redis: {
            host: c.get<string>('redis.host'),
            port: c.get<number>('redis.port'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    EntitesModule,
  ],
})
export class AppModule {}
