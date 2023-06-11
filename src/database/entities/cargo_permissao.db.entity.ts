import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CargoDbEntity } from './cargo.db.entity';
import { PermissaoDbEntity } from './permissao.db.entity';

@Entity('cargo_permissao')
export class CargoPermissaoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => CargoDbEntity)
  @JoinColumn({ name: 'id_cargo_fk' })
  cargo!: CargoDbEntity;

  @ManyToOne(() => PermissaoDbEntity)
  @JoinColumn({ name: 'id_permissao_fk' })
  permissao!: PermissaoDbEntity;
}
