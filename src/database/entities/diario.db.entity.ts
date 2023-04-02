import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AulaDbEntity } from './aula.db.entity';
import { DiarioProfessorDbEntity } from './diario-professor.db.entity';
import { DisciplinaDbEntity } from './disciplina.db.entity';
import { TurmaDbEntity } from './turma.db.entity';

@Entity('diario')
export class DiarioDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => TurmaDbEntity, (turma) => turma.diarios)
  @JoinColumn({ name: 'id_turma' })
  turma!: TurmaDbEntity;

  @ManyToOne(() => DisciplinaDbEntity, (disciplina) => disciplina.diarios)
  @JoinColumn({ name: 'id_disciplina' })
  disciplina!: DisciplinaDbEntity;

  @OneToMany(
    () => DiarioProfessorDbEntity,
    (diarioProfessor) => diarioProfessor.diario,
  )
  diarioProfessor!: DiarioProfessorDbEntity[];

  @OneToMany(() => AulaDbEntity, (aula) => aula.diario)
  aulas!: AulaDbEntity[];
}
