import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TurnoAulaDbEntity } from './turno-aula.db.entity';

@Entity('periodo_dia')
export class PeriodoDiaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'hora_inicio', type: 'timetz' })
  horaInicio!: string;

  @Column({ name: 'hora_fim', type: 'timetz' })
  horaFim!: string;

  @OneToMany(() => TurnoAulaDbEntity, (turnoAula) => turnoAula.periodoDia)
  turnoAula!: TurnoAulaDbEntity[];
}
