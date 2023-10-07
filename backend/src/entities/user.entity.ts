import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'username', type: 'varchar' })
  username?: string;

  @Column({ name: 'password', type: 'varchar' })
  password?: string;
}
