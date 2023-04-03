import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;
}
