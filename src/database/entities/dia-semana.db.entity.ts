import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TurnoAulaDbEntity } from './turno-aula.db.entity';

@Entity('dia_semana')
export class DiaSemanaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'ordem', type: 'int' })
  ordem!: number;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(() => TurnoAulaDbEntity, (turnoAula) => turnoAula.diaSemana)
  turnoAula!: TurnoAulaDbEntity[];
}
