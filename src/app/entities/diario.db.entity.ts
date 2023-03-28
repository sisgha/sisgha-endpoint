import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
