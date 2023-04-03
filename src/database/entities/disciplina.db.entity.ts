import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiarioDbEntity } from './diario.db.entity';
import { DisciplinaCursoDbEntity } from './disciplina-curso.db.entity';
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

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(() => DiarioDbEntity, (diario) => diario.disciplina)
  diarios!: DiarioDbEntity[];

  @OneToMany(
    () => DisciplinaCursoDbEntity,
    (disciplinaCurso) => disciplinaCurso.disciplina,
  )
  disciplinaCurso!: DisciplinaCursoDbEntity[];
}
