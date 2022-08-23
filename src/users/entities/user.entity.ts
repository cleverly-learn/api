import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  telegram?: string;

  @Column({ nullable: true })
  details?: string;
}
