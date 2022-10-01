import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity('lecturers')
export class Lecturer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  scheduleId!: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user!: User;
}
