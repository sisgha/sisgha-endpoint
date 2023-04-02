import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('deleted_rows_log')
export class DeletedRowsLogDbEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'table_name' })
  tableName!: string;

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_row_data', type: 'jsonb', nullable: true })
  deletedRowData!: any;

  @Column({ name: 'meilisearch_synced', type: 'boolean', default: false })
  meilisearchSynced!: boolean;
}
