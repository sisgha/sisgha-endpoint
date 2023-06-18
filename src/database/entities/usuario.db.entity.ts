import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioCargoDbEntity } from './usuario_cargo.db.entity';

@Entity('usuario')
export class UsuarioDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'email', nullable: true, type: 'text' })
  email!: string | null;

  @Column({ name: 'matricula_siape', nullable: true, type: 'text' })
  matriculaSiape!: string | null;

  //

  @Column({ name: 'keycloak_id', nullable: true, type: 'text' })
  keycloakId!: string | null;

  // ...

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

  // ...

  @OneToMany(() => UsuarioCargoDbEntity, (entity) => entity.usuario)
  usuarioCargo!: UsuarioCargoDbEntity[];
}
