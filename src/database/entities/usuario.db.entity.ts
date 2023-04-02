import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioHasCargoDbEntity } from './usuario-has-cargo.db.entity';

@Entity('usuario')
export class UsuarioDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'email', nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ name: 'keycloak_id', nullable: true, type: 'varchar' })
  keycloakId!: string | null;

  @Column({ name: 'matricula_siape', nullable: true, type: 'varchar' })
  matriculaSiape!: string | null;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(
    () => UsuarioHasCargoDbEntity,
    (usuarioHasCargo) => usuarioHasCargo.usuario,
  )
  usuarioHasCargo!: UsuarioHasCargoDbEntity[];
}
