import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginRes } from '../response/token.res';
import { JWT_LIFETIME, JWT_LOG_OUT, JWT_RF_LOG_OUT, JWT_SECRET } from 'src/constant/jwt';
import * as jwt from 'jsonwebtoken';
import { RefreshJwt } from 'src/common/decorator/auth.decorator';
import { ErrorCode } from 'src/constant/error';
import * as dayjs from 'dayjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RefreshTokenDto } from '../dto/rf-token.dto';
import { LogoutDto } from '../dto/logout.dto';

@Injectable()
export class SessionService {
  private readonly logger: Logger = new Logger();

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    protected cacheManager: Cache,
  ) {}

  async createTokenLogin({
    user,
    oldRefreshToken,
  }: {
    user?: UserEntity;
    oldRefreshToken?: string;
  }): Promise<LoginRes> {
    const payloadSign = {
      id: user.id,
      sub: user?.username,
      type: 'auth',
    };

    const token = this.jwtService.sign(payloadSign);
    const decode = this.jwtService.decode(token);

    let refreshToken = oldRefreshToken;
    let needRefresh = true;

    if (oldRefreshToken && oldRefreshToken !== '') {
      const jwtPayload = jwt.verify(oldRefreshToken, JWT_SECRET) as RefreshJwt;
      if (jwtPayload?.type !== 'refresh') {
        throw new UnauthorizedException(ErrorCode.FRESH_TOKEN_WRONG);
      }
      const now = dayjs().subtract(1, 'day');
      if (now.unix() < jwtPayload.exp) {
        needRefresh = false;
      }
    }

    if (needRefresh) {
      const payloadRefreshToken: RefreshJwt = {
        id: user.id,
        sub: user.username,
        type: 'refresh',
      };

      refreshToken = this.jwtService.sign(payloadRefreshToken, {
        expiresIn: '7d',
      });
    }

    return {
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: JWT_LIFETIME,
      expiresAt: decode['exp'],
    };
  }

  async refreshToken(payload: RefreshTokenDto) {
    let jwtPayload: RefreshJwt = null;
    try {
      jwtPayload = jwt.verify(payload.refreshToken, JWT_SECRET) as RefreshJwt;
    } catch (e) {
      throw new UnauthorizedException(ErrorCode.FRESH_TOKEN_WRONG);
    }

    const logout = await this.cacheManager.get(`${JWT_RF_LOG_OUT}.${payload.refreshToken}`);

    if (logout === JWT_RF_LOG_OUT) {
      throw new UnauthorizedException(ErrorCode.FRESH_TOKEN_WRONG);
    }

    if (jwtPayload.type !== 'refresh') {
      throw new UnauthorizedException(ErrorCode.FRESH_TOKEN_WRONG);
    }

    const user = await this.userRepo.findOne({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException(ErrorCode.CAN_NOT_LOGIN);
    }

    return await this.createTokenLogin({
      user,
      oldRefreshToken: payload.refreshToken,
    });
  }

  async deleteToken(payload: LogoutDto) {
    //logout access token
    try {
      const decode = this.jwtService.decode(payload.accessToken);
      const lifeTime = dayjs().unix() - decode['exp'] + 60;
      await this.cacheManager.set(
        `${JWT_LOG_OUT}.${payload.accessToken}`,
        JWT_LOG_OUT,
        lifeTime * 1000,
      );
    } catch (e) {
      this.logger.log(e);
    }

    //logout refresh token
    try {
      const decode = this.jwtService.decode(payload.refreshToken);
      const lifeTime = dayjs().unix() - decode['exp'] + 60;
      await this.cacheManager.set(
        `${JWT_RF_LOG_OUT}.${payload.refreshToken}`,
        JWT_RF_LOG_OUT,
        lifeTime * 1000,
      );
    } catch (e) {
      this.logger.log(e);
    }
  }
}
