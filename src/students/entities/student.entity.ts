import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from 'groups/entities/group.entity';
import { User } from 'users/entities/user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Group, { eager: true })
  @JoinColumn()
  group!: Group;
}
