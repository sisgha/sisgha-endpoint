import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DisciplinaCursoDbEntity } from './disciplina-curso.db.entity';

@Entity('curso')
export class CursoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;

  @Column({ name: 'tipo', type: 'varchar' })
  tipo!: string;

  @OneToMany(
    () => DisciplinaCursoDbEntity,
    (disciplinaCurso) => disciplinaCurso.curso,
  )
  disciplinaCurso!: DisciplinaCursoDbEntity[];
}
