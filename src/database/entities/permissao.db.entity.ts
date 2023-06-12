import { IRawConstraint } from 'src/authorization/interfaces';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CargoPermissaoDbEntity } from './cargo_permissao.db.entity';

@Entity('permissao')
export class PermissaoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'descricao', type: 'text', nullable: false, unique: true })
  descricao!: string;

  //

  @Column({ name: 'acao', type: 'text', nullable: false })
  acao!: string;

  @Column({ name: 'recurso', type: 'text', nullable: false })
  recurso!: string;

  //

  @Column({ name: 'constraint', type: 'json', nullable: false })
  constraint!: IRawConstraint;

  // ...

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

  // ...

  @OneToMany(() => CargoPermissaoDbEntity, (entity) => entity.permissao)
  cargoPermissao!: CargoPermissaoDbEntity[];
}
