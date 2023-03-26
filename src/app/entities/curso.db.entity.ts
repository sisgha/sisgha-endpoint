import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('curso')
export class CursoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;

  @Column({ name: 'tipo', type: 'varchar' })
  tipo!: string;
}
