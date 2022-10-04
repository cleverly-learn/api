import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Faculty } from 'faculties/entities/faculty.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  scheduleId!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Faculty, { eager: true })
  faculty!: Faculty;

  @Column({ default: '' })
  email!: string;
}
