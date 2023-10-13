import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CursoModel } from '../../../domain/models/curso.model';
import { ModalidadeDbEntity } from './modalidade.db.entity';

@Entity('curso')
export class CursoDbEntity implements CursoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'nome', nullable: false, type: 'text' })
  nome!: string;

  @Column({ name: 'nome_abreviado', nullable: false, type: 'text' })
  nomeAbreviado!: string;

  // ...

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz', nullable: false })
  dateCreated!: Date;

  @UpdateDateColumn({ name: 'date_updated', type: 'timestamptz', nullable: false })
  dateUpdated!: Date;

  @Column({ name: 'date_deleted', type: 'timestamptz', nullable: true })
  dateDeleted!: Date | null;

  @Column({ name: 'date_search_sync', type: 'timestamptz', nullable: true })
  dateSearchSync!: Date | null;

  // ...

  @ManyToOne(() => ModalidadeDbEntity)
  @JoinColumn({ name: 'id_modalidade_fk' })
  modalidade!: ModalidadeDbEntity;
}
