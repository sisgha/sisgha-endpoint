import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsuarioHasCargoDbEntity } from './usuario-has-cargo.db.entity';

@Entity('cargo')
export class CargoDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'slug', type: 'varchar' })
  slug!: string;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdate!: Date | null;

  @Column({ name: 'last_search_sync', type: 'timestamptz', nullable: true })
  lastSearchSync!: Date | null;

  @OneToMany(
    () => UsuarioHasCargoDbEntity,
    (usuarioHasCargo) => usuarioHasCargo.cargo,
  )
  usuarioHasCargo!: UsuarioHasCargoDbEntity[];
}
