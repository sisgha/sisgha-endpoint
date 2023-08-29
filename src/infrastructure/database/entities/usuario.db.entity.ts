import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioModel } from '../../../domain/models/usuario.model';
import { UsuarioCargoDbEntity } from './usuario_cargo.db.entity';

@Entity('usuario')
export class UsuarioDbEntity implements UsuarioModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'nome', nullable: true, type: 'text' })
  nome!: string | null;

  @Column({ name: 'email', nullable: true, type: 'text' })
  email!: string | null;

  @Column({ name: 'matricula_siape', nullable: true, type: 'text' })
  matriculaSiape!: string | null;

  @Column({ name: 'keycloak_id', nullable: true, type: 'text' })
  keycloakId!: string | null;

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

  @OneToMany(() => UsuarioCargoDbEntity, (entity) => entity.usuario)
  usuarioCargo!: UsuarioCargoDbEntity[];
}
