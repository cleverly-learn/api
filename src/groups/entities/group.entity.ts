import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Faculty } from 'faculties/entities/faculty.entity';
import { Student } from 'students/entities/student.entity';

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

  @OneToMany(() => Student, (student) => student.group)
  students!: Student[];
}
