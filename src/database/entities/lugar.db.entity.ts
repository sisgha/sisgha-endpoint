import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AulaDbEntity } from './aula.db.entity';
import { DisciplinaDbEntity } from './disciplina.db.entity';
import { TurmaDbEntity } from './turma.db.entity';

@Entity('lugar')
export class LugarDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'numero', type: 'varchar', nullable: true })
  numero!: string | null;

  @Column({ name: 'tipo', type: 'varchar', nullable: true })
  tipo!: string | null;

  @Column({ name: 'descricao', type: 'varchar', nullable: true })
  descricao!: string | null;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(() => DisciplinaDbEntity, (disciplina) => disciplina.lugarPadrao)
  disciplinas!: DisciplinaDbEntity[];

  @OneToMany(() => TurmaDbEntity, (turma) => turma.lugarPadrao)
  turmas!: TurmaDbEntity[];

  @OneToMany(() => AulaDbEntity, (aula) => aula.lugar)
  aulas!: AulaDbEntity[];
}
