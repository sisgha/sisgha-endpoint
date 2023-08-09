import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PermissaoRecursoModel } from '../../../domain/models';
import { PermissaoDbEntity } from './permissao.db.entity';

@Entity('permissao_recurso')
export class PermissaoRecursoDbEntity implements PermissaoRecursoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'recurso', type: 'text', nullable: true })
  recurso!: string;

  //

  permissaoId!: number;

  //

  @ManyToOne(() => PermissaoDbEntity)
  @JoinColumn({ name: 'id_permissao_fk' })
  permissao!: PermissaoDbEntity;

  //
}
