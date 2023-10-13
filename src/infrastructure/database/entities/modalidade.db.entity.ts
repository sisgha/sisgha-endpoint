import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ModalidadeModel } from '../../../domain/models';
import { CursoDbEntity } from './curso.db.entity';

@Entity('modalidade')
export class ModalidadeDbEntity implements ModalidadeModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'slug', type: 'text' })
  slug!: string;

  @Column({ name: 'nome', type: 'text' })
  nome!: string;

  //

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz', nullable: false })
  dateCreated!: Date;

  @UpdateDateColumn({ name: 'date_updated', type: 'timestamptz', nullable: false })
  dateUpdated!: Date;

  @Column({ name: 'date_deleted', type: 'timestamptz', nullable: true })
  dateDeleted!: Date | null;

  @Column({ name: 'date_search_sync', type: 'timestamptz', nullable: true })
  dateSearchSync!: Date | null;

  // ...

  @OneToMany(() => CursoDbEntity, (curso) => curso.modalidade)
  cursos!: CursoDbEntity[];
}
