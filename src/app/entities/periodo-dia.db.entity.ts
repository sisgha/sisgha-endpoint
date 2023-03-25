import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('periodo_dia')
export class PeriodoDiaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'hora_inicio', type: 'timetz' })
  horaInicio!: string;

  @Column({ name: 'hora_fim', type: 'timetz' })
  horaFim!: string;
}
