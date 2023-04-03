import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TurmaDbEntity } from './turma.db.entity';
import { TurnoAulaDbEntity } from './turno-aula.db.entity';

@Entity('turma_has_turno_aula')
export class TurmaHasTurnoAulaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => TurmaDbEntity, (turma) => turma.turno)
  @JoinColumn({ name: 'id_turma' })
  turma!: TurmaDbEntity;

  @ManyToOne(() => TurnoAulaDbEntity)
  @JoinColumn({ name: 'id_turno_aula' })
  turnoAula!: TurnoAulaDbEntity;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;
}
