import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SemanaStatus } from '../../app/modules/semana/interfaces/SemanaStatus';
import { AulaDbEntity } from './aula.db.entity';

@Entity('semana')
export class SemanaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'data_inicio', type: 'timestamp with time zone' })
  dataInicio!: Date;

  @Column({ name: 'data_fim', type: 'timestamp with time zone' })
  dataFim!: Date;

  @Column({ name: 'status', type: 'enum', enum: Object.values(SemanaStatus) })
  status!: SemanaStatus;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(() => AulaDbEntity, (aula) => aula.semana)
  aulas!: AulaDbEntity[];
}
