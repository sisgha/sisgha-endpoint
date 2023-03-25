import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
