import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiarioDbEntity } from './diario.db.entity';
import { ProfessorDbEntity } from './professor.db.entity';

@Entity('diario_professor')
export class DiarioProfessorDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => DiarioDbEntity, (diario) => diario.diarioProfessor)
  @JoinColumn({ name: 'id_diario' })
  diario!: DiarioDbEntity;

  @ManyToOne(() => ProfessorDbEntity, (professor) => professor.diarioProfessor)
  @JoinColumn({ name: 'id_professor' })
  professor!: ProfessorDbEntity;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;
}
