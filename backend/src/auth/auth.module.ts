import { Module } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './services/session.service';
import { JWT_LIFETIME, JWT_SECRET } from 'src/constant/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: `${JWT_LIFETIME}s` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SessionService],
  exports: [SessionService],
})
export class AuthModule {}
