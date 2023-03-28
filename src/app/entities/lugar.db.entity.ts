import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DisciplinaDbEntity } from './disciplina.db.entity';
import { TurmaDbEntity } from './turma.db.entity';

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

  @OneToMany(() => DisciplinaDbEntity, (disciplina) => disciplina.lugarPadrao)
  disciplinas!: DisciplinaDbEntity[];

  @OneToMany(() => TurmaDbEntity, (turma) => turma.lugarPadrao)
  turmas!: TurmaDbEntity[];
}
