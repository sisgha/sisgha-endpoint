import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CargoDbEntity } from './cargo.db.entity';
import { UsuarioInternoDbEntity } from './usuario_interno.db.entity';

@Entity('usuario_interno_cargo')
export class UsuarioInternoCargoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => UsuarioInternoDbEntity)
  @JoinColumn({ name: 'id_usuario_interno_fk' })
  usuarioInterno!: UsuarioInternoDbEntity;

  @ManyToOne(() => CargoDbEntity)
  @JoinColumn({ name: 'id_cargo_fk' })
  cargo!: CargoDbEntity;
}
