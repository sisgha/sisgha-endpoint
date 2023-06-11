import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AtorSimplesCargoDbEntity } from './ator_simples_cargo.db.entity';
import { CargoPermissaoDbEntity } from './cargo_permissao.db.entity';
import { UsuarioCargoDbEntity } from './usuario_cargo.db.entity';

@Entity('cargo')
export class CargoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'slug', type: 'text' })
  slug!: string;

  //

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: false,
  })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'search_sync_at', type: 'timestamptz', nullable: true })
  searchSyncAt!: Date | null;

  //

  @OneToMany(() => CargoPermissaoDbEntity, (entity) => entity.cargo)
  cargoPermissao!: CargoPermissaoDbEntity[];

  @OneToMany(() => UsuarioCargoDbEntity, (entity) => entity.cargo)
  usuarioCargo!: UsuarioCargoDbEntity[];

  @OneToMany(() => AtorSimplesCargoDbEntity, (entity) => entity.cargo)
  atorSimplesCargo!: AtorSimplesCargoDbEntity[];
}
