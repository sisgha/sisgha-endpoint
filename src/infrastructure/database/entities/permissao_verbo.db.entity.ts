import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PermissaoVerboModel } from '../../../domain/models';
import { PermissaoDbEntity } from './permissao.db.entity';

@Entity('permissao_verbo')
export class PermissaoVerboDbEntity implements PermissaoVerboModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'verbo', type: 'text', nullable: false })
  verbo!: string;

  //

  permissaoId!: number;

  //

  @ManyToOne(() => PermissaoDbEntity)
  @JoinColumn({ name: 'id_permissao_fk' })
  permissao!: PermissaoDbEntity;

  //
}
