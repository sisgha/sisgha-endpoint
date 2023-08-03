import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CargoDbEntity } from './cargo.db.entity';
import { UsuarioDbEntity } from './usuario.db.entity';
import { UsuarioCargoModel } from '../../../domain/models/usuario_cargo.model';

@Entity('usuario_cargo')
export class UsuarioCargoDbEntity implements UsuarioCargoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => UsuarioDbEntity)
  @JoinColumn({ name: 'id_usuario_fk' })
  usuario!: UsuarioDbEntity;

  @ManyToOne(() => CargoDbEntity)
  @JoinColumn({ name: 'id_cargo_fk' })
  cargo!: CargoDbEntity;
}
