import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Module({
  imports: [UserEntity],
})
export class EntitesModule {}
