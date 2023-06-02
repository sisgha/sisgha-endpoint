import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { pick } from 'lodash';
import MeiliSearch from 'meilisearch';
import { AppContext } from 'src/app/AppContext/AppContext';
import { ResourceActionRequest } from 'src/auth/interfaces/ResourceActionRequest';
import { DATA_SOURCE } from 'src/database/constants/DATA_SOURCE';
import { MEILISEARCH_CLIENT } from 'src/meilisearch/constants/MEILISEARCH_CLIENT.const';
import { DataSource } from 'typeorm';
import { DeletedRowsLogDbEntity } from '../database/entities/deleted-rows-log.db';
import { getDeletedRowsLogRepository } from '../database/repositories/deleted-rows-log.repository';
import { MeilisearchIndexDefinitions } from './config/MeiliSearchIndexDefinitions';
import { MEILISEARCH_SYNC_RECORDS_INTERVAL } from './constants/MEILISEARCH_SYNC_RECORDS_INTERVAL';
import { GenericSearchResult, IGenericListInput } from './dtos';
import { IMeiliSearchIndexDefinition } from './interfaces/MeiliSearchIndexDefinition';

@Injectable()
export class MeiliSearchService {
  private syncInProgress = false;
  private appContext = new AppContext(
    this.dataSource,
    ResourceActionRequest.forSystemInternalActions(),
  );

  constructor(
    @Inject(DATA_SOURCE)
    private dataSource: DataSource,
    @Inject(MEILISEARCH_CLIENT)
    private meilisearchClient: MeiliSearch,
  ) {}

  async findUpdatedRecords() {
    const findUpdatedRecordsGenerator = async function* (
      this: MeiliSearchService,
    ) {
      const getUpdatedRecordsForIndexDefinition = async (
        indexDefinition: IMeiliSearchIndexDefinition,
      ) => {
        return await this.appContext.databaseRun(async ({ entityManager }) => {
          const getRepository = indexDefinition.getTypeormRepositoryFactory();
          const repository = getRepository(entityManager);

          const records = await repository
            .createQueryBuilder('record')
            .select('record')
            .loadAllRelationIds({ disableMixedMap: true })
            .where('record.lastSearchSync IS NULL')
            .orWhere('record.lastSearchSync < record.lastUpdate')
            .limit(20)
            .getMany();

          return records;
        });
      };

      for (const indexDefinition of MeilisearchIndexDefinitions) {
        let records: any[] = [];

        do {
          records = await getUpdatedRecordsForIndexDefinition(indexDefinition);

          if (records.length > 0) {
            yield { indexDefinition, records };
          }
        } while (records.length > 0);
      }
    };

    return findUpdatedRecordsGenerator.call(this);
  }

  async findIndexDefinitionsDeletedRowLogs() {
    const findIndexDefinitionsDeletedRowLogsGenerator = async function* (
      this: MeiliSearchService,
    ) {
      const getDeletedRowLogsForIndexDefinition = async (
        indexDefinition: IMeiliSearchIndexDefinition,
      ) => {
        return await this.appContext.databaseRun(async ({ entityManager }) => {
          const getRepository = indexDefinition.getTypeormRepositoryFactory();
          const repository = getRepository(entityManager);
          const tableTame = repository.metadata.tableName;

          const deletedRowsLogRepository =
            getDeletedRowsLogRepository(entityManager);

          const records = await deletedRowsLogRepository
            .createQueryBuilder('deleted_rows_log')
            .where('deleted_rows_log.table_name = :tableName', {
              tableName: tableTame,
            })
            .andWhere('deleted_rows_log.meilisearch_synced = :synced', {
              synced: false,
            })
            .select('deleted_rows_log')
            .limit(50)
            .getMany();

          return records;
        });
      };

      for (const indexDefinition of MeilisearchIndexDefinitions) {
        let records: DeletedRowsLogDbEntity[] = [];

        do {
          records = await getDeletedRowLogsForIndexDefinition(indexDefinition);

          if (records.length > 0) {
            yield { indexDefinition, records };
          }
        } while (records.length > 0);
      }
    };

    return findIndexDefinitionsDeletedRowLogsGenerator.call(this);
  }

  async listResource<T extends { id: unknown }>(
    indexUid: string,
    dto: IGenericListInput,
  ): Promise<GenericSearchResult<T>> {
    const { query, limit, offset, filter, sort } = dto;

    const meilisearchResult = await this.meilisearchClient
      .index(indexUid)
      .search<T>(query, { limit, offset, filter, sort });

    const result = {
      query: meilisearchResult.query,

      limit: meilisearchResult.limit,
      offset: meilisearchResult.offset,

      total: meilisearchResult.estimatedTotalHits,

      items: meilisearchResult.hits,
    };

    return result;
  }

  async syncRecords() {
    if (this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;

    await this.syncDeletedRecords();
    await this.syncUpdatedRecords();

    this.syncInProgress = false;
  }

  @Interval(MEILISEARCH_SYNC_RECORDS_INTERVAL)
  async handleSyncRecordsInterval() {
    await this.syncRecords();
  }

  async deleteDocument(index: string, id: string) {
    const task = await this.meilisearchClient.index(index).deleteDocument(id);
    await this.meilisearchClient.index(index).waitForTask(task.taskUid);
  }

  private async syncUpdatedRecords() {
    const updatedRecords = await this.findUpdatedRecords();

    for await (const updatedRecord of updatedRecords) {
      const { indexDefinition, records } = updatedRecord;

      const documents = records.map((record) => {
        const searchableDataView =
          indexDefinition.getSearchableDataView(record);

        const data = Array.isArray(searchableDataView)
          ? pick(record, searchableDataView)
          : searchableDataView;

        return data;
      });

      const task = await this.meilisearchClient
        .index(indexDefinition.index)
        .updateDocuments([...documents], {
          primaryKey: indexDefinition.primaryKey,
        });

      await this.meilisearchClient
        .index(indexDefinition.index)
        .waitForTask(task.taskUid);

      await this.appContext.databaseRun(async ({ entityManager }) => {
        const entity = indexDefinition.getTypeormEntity();
        const getRepository = indexDefinition.getTypeormRepositoryFactory();
        const repository = getRepository(entityManager);

        await repository
          .createQueryBuilder()
          .update(entity)
          .set({ lastSearchSync: () => 'NOW()' })
          .whereInIds(records.map((r) => r.id))
          .execute();
      });
    }
  }

  private async syncDeletedRecords() {
    const deletedRecords = await this.findIndexDefinitionsDeletedRowLogs();

    for await (const deletedRowLogRecord of deletedRecords) {
      const { indexDefinition, records } = deletedRowLogRecord;

      const deletedDataIds = records.map((record) => record.deletedRowData.id);

      const task = await this.meilisearchClient
        .index(indexDefinition.index)
        .deleteDocuments([...deletedDataIds]);

      await this.meilisearchClient
        .index(indexDefinition.index)
        .waitForTask(task.taskUid);

      await this.appContext.databaseRun(async ({ entityManager }) => {
        const deletedRowsRepository =
          getDeletedRowsLogRepository(entityManager);

        // await deletedRowsRepository
        //   .createQueryBuilder()
        //   .update()
        //   .set({ meilisearchSynced: true })
        //   .whereInIds(records.map((r) => r.id))
        //   .execute();

        await deletedRowsRepository
          .createQueryBuilder()
          .delete()
          .whereInIds(records.map((r) => r.id))
          .execute();
      });
    }
  }
}
