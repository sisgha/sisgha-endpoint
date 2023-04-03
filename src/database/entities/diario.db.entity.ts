import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(() => AulaDbEntity, (aula) => aula.diario)
  aulas!: AulaDbEntity[];

  @OneToMany(
    () => DiarioProfessorDbEntity,
    (diarioProfessor) => diarioProfessor.diario,
  )
  diarioProfessor!: DiarioProfessorDbEntity[];
}
