import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DiarioProfessorDbEntity } from './diario-professor.db.entity';

@Entity('professor')
export class ProfessorDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;

  @OneToMany(
    () => DiarioProfessorDbEntity,
    (diarioProfessor) => diarioProfessor.professor,
  )
  diarioProfessor!: DiarioProfessorDbEntity[];
}
