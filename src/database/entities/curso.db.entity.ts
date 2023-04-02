import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DisciplinaCursoDbEntity } from './disciplina-curso.db.entity';
import { TurmaDbEntity } from './turma.db.entity';

@Entity('curso')
export class CursoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;

  @Column({ name: 'tipo', type: 'varchar' })
  tipo!: string;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(
    () => DisciplinaCursoDbEntity,
    (disciplinaCurso) => disciplinaCurso.curso,
  )
  disciplinaCurso!: DisciplinaCursoDbEntity[];

  @OneToMany(() => TurmaDbEntity, (turma) => turma.curso)
  turmas!: TurmaDbEntity[];
}
