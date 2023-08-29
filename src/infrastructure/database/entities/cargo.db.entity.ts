import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CargoModel } from '../../../domain/models';
import { CargoPermissaoDbEntity } from './cargo_permissao.db.entity';
import { UsuarioCargoDbEntity } from './usuario_cargo.db.entity';
import { UsuarioInternoCargoDbEntity } from './usuario_interno_cargo.db.entity';

@Entity('cargo')
export class CargoDbEntity implements CargoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'slug', type: 'text' })
  slug!: string;

  //

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz', nullable: false })
  dateCreated!: Date;

  @UpdateDateColumn({ name: 'date_updated', type: 'timestamptz', nullable: false })
  dateUpdated!: Date;

  @Column({ name: 'date_deleted', type: 'timestamptz', nullable: true })
  dateDeleted!: Date | null;

  @Column({ name: 'date_search_sync', type: 'timestamptz', nullable: true })
  dateSearchSync!: Date | null;

  // ...

  @OneToMany(() => CargoPermissaoDbEntity, (entity) => entity.cargo)
  cargoPermissao!: CargoPermissaoDbEntity[];

  @OneToMany(() => UsuarioCargoDbEntity, (entity) => entity.cargo)
  usuarioCargo!: UsuarioCargoDbEntity[];

  @OneToMany(() => UsuarioInternoCargoDbEntity, (entity) => entity.cargo)
  usuarioInternoCargo!: UsuarioInternoCargoDbEntity[];
}
