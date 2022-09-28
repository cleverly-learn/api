import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Faculty } from 'groups/entities/faculty.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ unique: true })
  scheduleId!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Faculty, { eager: true })
  faculty!: Faculty;

  @Column({ default: '' })
  email!: string;
}