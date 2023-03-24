import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioHasCargoDbEntity } from './usuario-has-cargo.db.entity';

@Entity('cargo')
export class CargoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'slug', type: 'varchar' })
  slug!: string;

  @OneToMany(
    () => UsuarioHasCargoDbEntity,
    (usuarioHasCargo) => usuarioHasCargo.cargo,
  )
  usuarioHasCargo!: UsuarioHasCargoDbEntity[];
}
