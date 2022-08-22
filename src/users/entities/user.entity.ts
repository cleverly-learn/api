import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  login!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
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
