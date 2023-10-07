import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/base/services/base.service';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseCrudService<UserEntity> {
  constructor(@InjectRepository(UserEntity) public repository: Repository<UserEntity>) {
    super(repository);
  }
}
