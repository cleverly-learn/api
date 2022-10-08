import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  login!: string;

  @Exclude()
  @Column({ default: '', select: false })
  password!: string;

  @Column({ default: '' })
  email!: string;

  @Column({ default: false })
  isRegistered!: boolean;

  @Column({ default: false })
  isAdmin!: boolean;

  @Column({ default: '' })
  firstName!: string;

  @Column({ default: '' })
  lastName!: string;

  @Column({ default: '' })
  patronymic!: string;

  @Column({ default: '' })
  phone!: string;

  @Column({ default: '' })
  telegram!: string;

  @Column({ default: '' })
  details!: string;
}
