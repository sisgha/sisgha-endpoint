import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiarioDbEntity } from './diario.db.entity';
import { LugarDbEntity } from './lugar.db.entity';
import { SemanaDbEntity } from './semana.db.entity';
import { TurnoAulaDbEntity } from './turno-aula.db.entity';

@Entity('aula')
export class AulaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => DiarioDbEntity)
  @JoinColumn({ name: 'id_diario' })
  diario!: DiarioDbEntity;

  @ManyToOne(() => SemanaDbEntity, { nullable: true })
  @JoinColumn({ name: 'id_semana' })
  semana!: SemanaDbEntity | null;

  @ManyToOne(() => TurnoAulaDbEntity, { nullable: true })
  @JoinColumn({ name: 'id_turno_aula' })
  turnoAula!: TurnoAulaDbEntity | null;

  @ManyToOne(() => LugarDbEntity, { nullable: true })
  @JoinColumn({ name: 'id_lugar' })
  lugar!: LugarDbEntity | null;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;
}
