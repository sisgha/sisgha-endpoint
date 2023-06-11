import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CargoDbEntity } from './cargo.db.entity';
import { UsuarioDbEntity } from './usuario.db.entity';

@Entity('usuario_cargo')
export class UsuarioCargoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => UsuarioDbEntity)
  @JoinColumn({ name: 'id_usuario_fk' })
  usuario!: UsuarioDbEntity;

  @ManyToOne(() => CargoDbEntity)
  @JoinColumn({ name: 'id_cargo_fk' })
  cargo!: CargoDbEntity;
}
