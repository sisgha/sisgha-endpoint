import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @OneToMany(
    () => TurmaHasTurnoAulaDbEntity,
    (turmaHasTurnoAula) => turmaHasTurnoAula.turnoAula,
  )
  turmaHasTurnoAula!: TurmaHasTurnoAulaDbEntity[];
}
