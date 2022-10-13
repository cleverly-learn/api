import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from 'groups/entities/group.entity';
import { Lecturer } from 'lecturers/entities/lecturer.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Lecturer)
  @JoinColumn()
  owner!: Lecturer;

  @Column({ default: '' })
  name!: string;

  @Column()
  classroomId!: string;

  @Column()
  classroomLink!: string;

  @ManyToMany(() => Group)
  @JoinTable()
  groups!: Group[];
}
