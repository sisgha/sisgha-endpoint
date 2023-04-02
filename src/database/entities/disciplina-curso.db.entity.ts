import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CursoDbEntity } from './curso.db.entity';
import { DisciplinaDbEntity } from './disciplina.db.entity';

@Entity('disciplina_curso')
export class DisciplinaCursoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => DisciplinaDbEntity)
  @JoinColumn({ name: 'id_disciplina' })
  disciplina!: DisciplinaDbEntity;

  @ManyToOne(() => CursoDbEntity)
  @JoinColumn({ name: 'id_curso' })
  curso!: CursoDbEntity;
}
