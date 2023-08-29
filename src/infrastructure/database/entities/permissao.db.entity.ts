import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IAuthorizationConstraintRecipe } from '../../../domain/authorization-constraints';
import { PermissaoModel } from '../../../domain/models/permissao.model';
import { CargoPermissaoDbEntity } from './cargo_permissao.db.entity';
import { PermissaoRecursoDbEntity } from './permissao_recurso.db.entity';
import { PermissaoVerboDbEntity } from './permissao_verbo.db.entity';

@Entity('permissao')
export class PermissaoDbEntity implements PermissaoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'descricao', type: 'text', nullable: false, unique: true })
  descricao!: string;

  @Column({ name: 'verbo_global', type: 'boolean', nullable: false })
  verboGlobal!: boolean;

  @Column({ name: 'recurso_global', type: 'boolean', nullable: false })
  recursoGlobal!: boolean;

  //

  @Column({ name: 'authorization_constraint_recipe', type: 'json', nullable: false })
  authorizationConstraintRecipe!: IAuthorizationConstraintRecipe;

  // ...

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz', nullable: false })
  dateCreated!: Date;

  @UpdateDateColumn({ name: 'date_updated', type: 'timestamptz', nullable: false })
  dateUpdated!: Date;

  @Column({ name: 'date_deleted', type: 'timestamptz', nullable: true })
  dateDeleted!: Date | null;

  @Column({ name: 'date_search_sync', type: 'timestamptz', nullable: true })
  dateSearchSync!: Date | null;

  // ...

  @OneToMany(() => PermissaoVerboDbEntity, (entity) => entity.permissao)
  verbos!: PermissaoVerboDbEntity[];

  @OneToMany(() => PermissaoRecursoDbEntity, (entity) => entity.permissao)
  recursos!: PermissaoRecursoDbEntity[];

  @OneToMany(() => CargoPermissaoDbEntity, (entity) => entity.permissao)
  cargoPermissao!: CargoPermissaoDbEntity[];
}
