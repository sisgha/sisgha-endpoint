import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TurmaDbEntity } from './turma.db.entity';
import { TurnoAulaDbEntity } from './turno-aula.db.entity';

@Entity('turma_has_turno_aula')
export class TurmaHasTurnoAulaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => TurmaDbEntity, turma => turma.turno)
  @JoinColumn({ name: 'id_turma' })
  turma!: TurmaDbEntity;

  @ManyToOne(() => TurnoAulaDbEntity)
  @JoinColumn({ name: 'id_turno_aula' })
  turnoAula!: TurnoAulaDbEntity;
}
