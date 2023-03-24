import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CargoDbEntity } from './cargo.db.entity';
import { UsuarioDbEntity } from './usuario.db.entity';

@Entity('usuario_has_cargo')
export class UsuarioHasCargoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => UsuarioDbEntity)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: UsuarioDbEntity;

  @ManyToOne(() => CargoDbEntity)
  @JoinColumn({ name: 'id_cargo' })
  cargo!: CargoDbEntity;
}
