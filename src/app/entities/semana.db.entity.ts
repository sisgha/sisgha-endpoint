import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SemanaStatus } from '../modules/semana/interfaces/SemanaStatus';

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
}
