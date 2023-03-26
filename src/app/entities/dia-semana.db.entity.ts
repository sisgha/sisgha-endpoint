import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TurnoAulaDbEntity } from './turno-aula.db.entity';

@Entity('dia_semana')
export class DiaSemanaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'ordem', type: 'int' })
  ordem!: number;

  @OneToMany(() => TurnoAulaDbEntity, (turnoAula) => turnoAula.diaSemana)
  turnoAula!: TurnoAulaDbEntity[];
}
