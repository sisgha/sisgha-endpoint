import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiarioProfessorDbEntity } from './diario-professor.db.entity';

@Entity('professor')
export class ProfessorDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(
    () => DiarioProfessorDbEntity,
    (diarioProfessor) => diarioProfessor.professor,
  )
  diarioProfessor!: DiarioProfessorDbEntity[];
}
