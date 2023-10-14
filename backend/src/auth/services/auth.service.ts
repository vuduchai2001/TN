import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { LoginRes } from '../response/token.res';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CNotFoundException } from 'src/common/exception/404.exception';
import { ErrorCode } from 'src/constant/error';
import * as bcrypt from 'bcrypt';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly sessionService: SessionService,
  ) {}

  async login(payload: LoginDto): Promise<LoginRes> {
    const user = await this.userRepo.findOne({
      where: {
        username: payload.username,
      },
    });

    if (!user) {
      throw new CNotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    if (!bcrypt.compareSync(payload?.password, user?.password)) {
      throw new CNotFoundException(ErrorCode.INVALID_PASSWORD);
    }

    return this.sessionService.createTokenLogin({ user });
  }
}
