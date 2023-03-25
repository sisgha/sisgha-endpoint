import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dia_semana')
export class DiaSemanaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'ordem', type: 'int' })
  ordem!: number;
}
