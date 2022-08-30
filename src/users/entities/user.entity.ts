import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  login!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column()
  email!: string;

  @Column({ default: false })
  isRegistered!: boolean;

  @Column({ default: false })
  isAdmin!: boolean;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  patronymic!: string;

  @Column()
  phone!: string;

  @Column()
  telegram!: string;

  @Column()
  details!: string;
}
