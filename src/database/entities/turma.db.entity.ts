import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CursoDbEntity } from './curso.db.entity';
import { DiarioDbEntity } from './diario.db.entity';
import { LugarDbEntity } from './lugar.db.entity';
import { TurmaHasTurnoAulaDbEntity } from './turma-has-turno-aula.db.entity';

@Entity('turma')
export class TurmaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'periodo', type: 'varchar' })
  periodo!: string;

  @Column({ name: 'turno', type: 'varchar' })
  turno!: string | null;

  @ManyToOne(() => CursoDbEntity, (curso) => curso.turmas)
  @JoinColumn({ name: 'id_curso' })
  curso!: CursoDbEntity;

  @ManyToOne(() => LugarDbEntity, (lugar) => lugar.turmas, { nullable: true })
  @JoinColumn({ name: 'id_lugar_padrao' })
  lugarPadrao!: LugarDbEntity | null;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(
    () => TurmaHasTurnoAulaDbEntity,
    (turmaHasTurnoAula) => turmaHasTurnoAula.turma,
  )
  turmaHasTurnoAula!: TurmaHasTurnoAulaDbEntity[];

  @OneToMany(() => DiarioDbEntity, (diario) => diario.turma)
  diarios!: DiarioDbEntity[];
}
