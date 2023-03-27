import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LugarDbEntity } from './lugar.db.entity';

@Entity('disciplina')
export class DisciplinaDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;

  @ManyToOne(() => LugarDbEntity, { nullable: true })
  @JoinColumn({ name: 'id_lugar_padrao' })
  lugarPadrao!: LugarDbEntity | null;
}
