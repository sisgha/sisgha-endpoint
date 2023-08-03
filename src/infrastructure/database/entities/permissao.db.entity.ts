import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CargoPermissaoDbEntity } from './cargo_permissao.db.entity';
import { PermissaoModel } from '../../../domain/models/permissao.model';
import { IAuthorizationConstraintRecipe } from '../../../domain/authorization-constraints';

@Entity('permissao')
export class PermissaoDbEntity implements PermissaoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'descricao', type: 'text', nullable: false, unique: true })
  descricao!: string;

  @Column({ name: 'acao', type: 'text', nullable: false })
  acao!: string;

  @Column({ name: 'recurso', type: 'text', nullable: false })
  recurso!: string;

  //

  @Column({ name: 'constraint', type: 'json', nullable: false })
  constraint!: IAuthorizationConstraintRecipe;

  // ...

  @CreateDateColumn({
    name: 'date_created',
    type: 'timestamptz',
    nullable: false,
  })
  dateCreated!: Date;

  @UpdateDateColumn({
    name: 'date_updated',
    type: 'timestamptz',
    nullable: false,
  })
  dateUpdated!: Date;

  @Column({ name: 'date_deleted', type: 'timestamptz', nullable: true })
  dateDeleted!: Date | null;

  @Column({ name: 'date_search_sync', type: 'timestamptz', nullable: true })
  dateSearchSync!: Date | null;

  // ...

  @OneToMany(() => CargoPermissaoDbEntity, (entity) => entity.permissao)
  cargoPermissao!: CargoPermissaoDbEntity[];
}
