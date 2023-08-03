import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CargoDbEntity } from './cargo.db.entity';
import { PermissaoDbEntity } from './permissao.db.entity';
import { CargoPermissaoModel } from '../../../domain/models/cargo_permissao.model';

@Entity('cargo_permissao')
export class CargoPermissaoDbEntity implements CargoPermissaoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => CargoDbEntity)
  @JoinColumn({ name: 'id_cargo_fk' })
  cargo!: CargoDbEntity;

  @ManyToOne(() => PermissaoDbEntity)
  @JoinColumn({ name: 'id_permissao_fk' })
  permissao!: PermissaoDbEntity;
}
