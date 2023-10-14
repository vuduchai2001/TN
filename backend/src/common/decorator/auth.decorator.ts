import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { JWT_LOG_OUT } from 'src/constant/jwt';

export interface RefreshJwt extends JwtPayload {
  id: number;
  sub: string;
  type?: string;
}

export const CurrentUser = createParamDecorator((_, context: ExecutionContext) => {
  const { user } = context.switchToHttp().getRequest();
  return user;
});

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  @Inject(CACHE_MANAGER)
  protected cacheManager: Cache;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    let authorization = request.headers?.authorization;

    if (!authorization || authorization === '') {
      throw new UnauthorizedException();
    }

    const tokens = authorization.split(' ');
    if (!tokens || tokens.length !== 2) {
      throw new UnauthorizedException();
    }

    const x = await super.canActivate(context);
    if (!x) {
      throw new UnauthorizedException();
    }

    const value = await this.cacheManager.get(`${JWT_LOG_OUT}.${tokens[1]}`);
    if (value && value === JWT_LOG_OUT) {
      throw new UnauthorizedException();
    }

    return true;
  }

  getRequest<T = any>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }
}
