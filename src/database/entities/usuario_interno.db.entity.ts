import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioInternoCargoDbEntity } from './usuario_interno_cargo.db.entity';

@Entity('usuario_interno')
export class UsuarioInternoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'tipo_ator', type: 'text' })
  tipoAtor!: string;

  //

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: false,
  })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'search_sync_at', type: 'timestamptz', nullable: true })
  searchSyncAt!: Date | null;

  //

  @OneToMany(() => UsuarioInternoCargoDbEntity, (entity) => entity.usuarioInterno)
  usuarioInternoCargo!: UsuarioInternoCargoDbEntity[];
}
