import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CursoDbEntity } from './curso.db.entity';
import { LugarDbEntity } from './lugar.db.entity';

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
}
