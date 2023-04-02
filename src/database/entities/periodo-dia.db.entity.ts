import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TurnoAulaDbEntity } from './turno-aula.db.entity';

@Entity('periodo_dia')
export class PeriodoDiaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'hora_inicio', type: 'timetz' })
  horaInicio!: string;

  @Column({ name: 'hora_fim', type: 'timetz' })
  horaFim!: string;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(() => TurnoAulaDbEntity, (turnoAula) => turnoAula.periodoDia)
  turnoAula!: TurnoAulaDbEntity[];
}
