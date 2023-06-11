import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AtorSimplesDbEntity } from './ator_simples.db.entity';
import { CargoDbEntity } from './cargo.db.entity';

@Entity('ator_simples_cargo')
export class AtorSimplesCargoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ManyToOne(() => AtorSimplesDbEntity)
  @JoinColumn({ name: 'id_ator_simples_fk' })
  atorSimples!: AtorSimplesDbEntity;

  @ManyToOne(() => CargoDbEntity)
  @JoinColumn({ name: 'id_cargo_fk' })
  cargo!: CargoDbEntity;
}
