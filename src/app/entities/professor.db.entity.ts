import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('professor')
export class ProfessorDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;
}
