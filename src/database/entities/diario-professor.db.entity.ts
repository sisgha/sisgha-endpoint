import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
