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
import { DiaSemanaDbEntity } from './dia-semana.db.entity';
import { PeriodoDiaDbEntity } from './periodo-dia.db.entity';
import { TurmaHasTurnoAulaDbEntity } from './turma-has-turno-aula.db.entity';

@Entity('turno_aula')
export class TurnoAulaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => DiaSemanaDbEntity)
  @JoinColumn({ name: 'id_dia_semana' })
  diaSemana!: DiaSemanaDbEntity;

  @ManyToOne(() => PeriodoDiaDbEntity)
  @JoinColumn({ name: 'id_periodo_dia' })
  periodoDia!: PeriodoDiaDbEntity;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(() => AulaDbEntity, (aula) => aula.turnoAula)
  aulas!: AulaDbEntity[];

  @OneToMany(
    () => TurmaHasTurnoAulaDbEntity,
    (turmaHasTurnoAula) => turmaHasTurnoAula.turnoAula,
  )
  turmaHasTurnoAula!: TurmaHasTurnoAulaDbEntity[];
}
