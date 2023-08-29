import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioInternoModel } from '../../../domain/models/usuario_interno.model';
import { UsuarioInternoCargoDbEntity } from './usuario_interno_cargo.db.entity';

@Entity('usuario_interno')
export class UsuarioInternoDbEntity implements UsuarioInternoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'tipo_entidade', type: 'text' })
  tipoEntidade!: string;

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

  @OneToMany(() => UsuarioInternoCargoDbEntity, (entity) => entity.usuarioInterno)
  usuarioInternoCargo!: UsuarioInternoCargoDbEntity[];
}
