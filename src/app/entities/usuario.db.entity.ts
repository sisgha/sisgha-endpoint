import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(
    () => UsuarioHasCargoDbEntity,
    (usuarioHasCargo) => usuarioHasCargo.usuario,
  )
  usuarioHasCargo!: UsuarioHasCargoDbEntity[];
}
