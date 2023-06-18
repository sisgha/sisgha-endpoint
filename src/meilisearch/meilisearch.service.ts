import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { pick } from 'lodash';
import MeiliSearch from 'meilisearch';
import { ActorContext } from 'src/actor-context/ActorContext';
import { IAppResource } from 'src/actor-context/interfaces';
import { APP_RESOURCES } from 'src/actor-context/providers';
import { DATA_SOURCE } from 'src/database/constants/DATA_SOURCE';
import { DataSource } from 'typeorm';
import { MEILISEARCH_CLIENT } from './consts/MEILISEARCH_CLIENT.const';
import { MEILISEARCH_PRIMARY_KEY } from './consts/MEILISEARCH_PRIMARY_KEY.const';
import { MEILISEARCH_SYNC_RECORDS_INTERVAL } from './consts/MEILISEARCH_SYNC_RECORDS_INTERVAL';
import { GenericSearchResult, IGenericListInput } from './dtos';

@Injectable()
export class MeiliSearchService {
  private isSyncInProgress = false;

  private systemActorContext: ActorContext;

  constructor(
    @Inject(DATA_SOURCE)
    private dataSource: DataSource,
    @Inject(MEILISEARCH_CLIENT)
    private meilisearchClient: MeiliSearch,
  ) {
    this.systemActorContext = ActorContext.forSystem(dataSource);
  }

  async listResource<T extends { id: K }, K = unknown>(
    indexUid: string,
    dto: IGenericListInput,
    targetIds: K[] | null = null,
  ): Promise<GenericSearchResult<T>> {
    const { query, limit, offset, sort } = dto;

    const filter: string[] = [
      // ...
      ...(Array.isArray(targetIds) ? [`id IN ${JSON.stringify(targetIds)}`] : []),
      ...(dto.filter ? [dto.filter] : []),
    ];

    const meilisearchResult = await this.meilisearchClient.index(indexUid).search<T>(query, {
      limit,
      offset,
      filter,
      sort,
    });

    const result = {
      query: meilisearchResult.query,

      limit: meilisearchResult.limit,
      offset: meilisearchResult.offset,

      total: meilisearchResult.estimatedTotalHits,

      items: meilisearchResult.hits,
    };

    return result;
  }

  async handleSyncRecords() {
    if (this.isSyncInProgress) {
      return;
    }

    this.isSyncInProgress = true;

    await this.syncRecords();

    this.isSyncInProgress = false;
  }

  @Interval(MEILISEARCH_SYNC_RECORDS_INTERVAL)
  async handleSyncRecordsInterval() {
    await this.handleSyncRecords();
  }

  async handleDeletedRecords(appResource: IAppResource, deletedRecords: any[]) {
    const appResourceSearchOptions = appResource.search;

    if (deletedRecords.length === 0 || !appResourceSearchOptions) {
      return;
    }

    const deletedRecordsIds = deletedRecords.map((record) => record.id);

    const deleteDocumentsTask = await this.meilisearchClient
      .index(appResourceSearchOptions.meilisearchIndex)
      .deleteDocuments([...deletedRecordsIds]);

    await this.meilisearchClient.index(appResourceSearchOptions.meilisearchIndex).waitForTask(deleteDocumentsTask.taskUid);
  }

  async handleUpdatedRecords(appResource: IAppResource, updatedRecords: any[]) {
    const appResourceSearchOptions = appResource.search;

    if (updatedRecords.length === 0 || !appResourceSearchOptions) {
      return;
    }

    const updatedDocuments = updatedRecords.map((record) => {
      const searchableDataView = appResourceSearchOptions.getSearchableDataView(record);

      const data = Array.isArray(searchableDataView) ? pick(record, searchableDataView) : searchableDataView;

      return data;
    });

    const updateDocumentsTask = await this.meilisearchClient
      .index(appResourceSearchOptions.meilisearchIndex)
      .updateDocuments([...updatedDocuments], { primaryKey: MEILISEARCH_PRIMARY_KEY });

    await this.meilisearchClient.index(appResourceSearchOptions.meilisearchIndex).waitForTask(updateDocumentsTask.taskUid);
  }

  async updateRecordsSearchSyncAt(appResource: IAppResource, records: any[]) {
    if (records.length === 0) {
      return;
    }

    await this.systemActorContext.databaseRun(async ({ entityManager }) => {
      const entity = appResource.getTypeormEntity();

      const getRepository = appResource.getTypeormRepositoryFactory();
      const repository = getRepository(entityManager);

      await repository
        .createQueryBuilder()
        .update(entity)
        .set({
          updatedAt: () => 'NOW()',
          searchSyncAt: () => 'NOW()',
        })
        .whereInIds(records.map((r) => r.id))
        .execute();
    });
  }

  private async findRecordsNotSynced() {
    const findRecordsNotSyncedGenerator = async function* (this: MeiliSearchService) {
      const getRecordsNotSyncedForAppResource = async (appResource: IAppResource) => {
        if (!appResource.search) {
          return [];
        }

        return await this.systemActorContext.databaseRun(async ({ entityManager }) => {
          const getRepository = appResource.getTypeormRepositoryFactory();
          const repository = getRepository(entityManager);

          try {
            const records = await repository
              .createQueryBuilder('record')
              .select('record')
              .loadAllRelationIds({ disableMixedMap: true })
              .where('record.searchSyncAt IS NULL')
              .orWhere('record.searchSyncAt < record.updatedAt')
              .limit(10)
              .getMany();

            return records;
          } catch (e) {
            return [];
          }
        });
      };

      for (const appResource of APP_RESOURCES) {
        let recordsNotSynced: any[] = [];

        do {
          recordsNotSynced = await getRecordsNotSyncedForAppResource(appResource);

          if (recordsNotSynced.length > 0) {
            yield {
              appResource,
              records: recordsNotSynced,
            };
          }
        } while (recordsNotSynced.length > 0);
      }
    };

    return findRecordsNotSyncedGenerator.call(this);
  }

  private async syncRecords() {
    const recordsNotSynced = await this.findRecordsNotSynced();

    for await (const recordNotSynced of recordsNotSynced) {
      const { appResource, records } = recordNotSynced;

      // const deletedRecords = records.filter((record) => record.deletedAt !== null);
      // await this.handleDeletedRecords(appResource, deletedRecords);

      // const updatedRecords = records.filter((record) => record.deletedAt === null);
      // await this.handleUpdatedRecords(appResource, updatedRecords);

      await this.handleUpdatedRecords(appResource, records);

      await this.updateRecordsSearchSyncAt(appResource, records);
    }
  }
}
