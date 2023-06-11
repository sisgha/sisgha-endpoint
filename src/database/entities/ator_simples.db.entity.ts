import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AtorSimplesCargoDbEntity } from './ator_simples_cargo.db.entity';

@Entity('ator_simples')
export class AtorSimplesDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  // ...

  @Column({ name: 'tipo', type: 'text' })
  tipo!: string;

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

  @OneToMany(() => AtorSimplesCargoDbEntity, (entity) => entity.atorSimples)
  atorSimplesCargo!: AtorSimplesCargoDbEntity[];
}
