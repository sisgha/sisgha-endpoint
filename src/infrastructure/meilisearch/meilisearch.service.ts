import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Interval } from '@nestjs/schedule';
import { has } from 'lodash';
import MeiliSearch from 'meilisearch';
import { ActorContext } from 'src/infrastructure/actor-context/ActorContext';
import { APP_DATA_SOURCE_TOKEN } from 'src/infrastructure/database/tokens/APP_DATA_SOURCE_TOKEN';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { IAppResource } from '../../domain/application-resources';
import { IGenericSearchResult } from '../../domain/dtos';
import { IGenericListInput } from '../../domain/search/IGenericListInput';
import { APP_RESOURCES } from '../application/helpers';
import { MEILISEARCH_PRIMARY_KEY } from '../config/MEILISEARCH_PRIMARY_KEY';
import { MEILISEARCH_SYNC_RECORDS_INTERVAL } from '../config/MEILISEARCH_SYNC_RECORDS_INTERVAL';
import { parralelMap } from '../helpers/parralel-map';
import { MEILISEARCH_CLIENT_TOKEN } from './tokens/MEILISEARCH_CLIENT_TOKEN';

enum RecordDeletionMode {
  DELETE_FROM_SEARCH,
  JUST_UPDATE,
}

const RECORD_DELETION_MODE: RecordDeletionMode = RecordDeletionMode.JUST_UPDATE;

@Injectable()
export class MeiliSearchService {
  private isSyncInProgress = false;

  private systemActorContext: ActorContext;

  constructor(
    @Inject(APP_DATA_SOURCE_TOKEN)
    dataSource: DataSource,

    @Inject(MEILISEARCH_CLIENT_TOKEN)
    private meiliSearchClient: MeiliSearch,
  ) {
    this.systemActorContext = ActorContext.forSystem(dataSource);
  }

  async listResource<T extends { id: K }, K = unknown>(
    indexUid: string,
    dto: IGenericListInput,
    targetIds: K[] | null = null,
  ): Promise<IGenericSearchResult<T>> {
    const { query, limit, offset, sort } = dto;

    const filter: string[] = [
      // ...
      ...(Array.isArray(targetIds) ? [`id IN ${JSON.stringify(targetIds)}`] : []),
      ...(dto.filter ? [dto.filter] : []),
    ];

    const meiliSearchResult = await this.meiliSearchClient.index(indexUid).search<T>(query, {
      limit,
      offset,
      filter,
      sort,
    });

    const result = {
      query: meiliSearchResult.query,

      limit: meiliSearchResult.limit,
      offset: meiliSearchResult.offset,

      total: meiliSearchResult.estimatedTotalHits,

      items: meiliSearchResult.hits,
    };

    return result;
  }

  async dispatchRecordsSync() {
    if (this.isSyncInProgress) {
      return;
    }

    this.isSyncInProgress = true;

    await this.performRecordsSync();

    this.isSyncInProgress = false;
  }

  @Interval(MEILISEARCH_SYNC_RECORDS_INTERVAL)
  async handleSyncRecordsInterval() {
    await this.dispatchRecordsSync();
  }

  @OnEvent('change-subscriber.event.*')
  async handleSubscriberEvent() {
    await this.dispatchRecordsSync();
  }

  async performRecordsDelete(appResource: IAppResource, records: any[]) {
    const appResourceSearchOptions = appResource.search;

    if (records.length === 0 || !appResourceSearchOptions) {
      return;
    }

    const resourceIndex = this.meiliSearchClient.index(appResourceSearchOptions.meiliSearchIndex);

    const deletedRecordsIds = records.map((record) => record.id);

    const deleteDocumentsTask = await resourceIndex.deleteDocuments([...deletedRecordsIds]);

    await resourceIndex.waitForTask(deleteDocumentsTask.taskUid);
  }

  async performRecordsUpdate(appResource: IAppResource, records: any[]) {
    const resourceSearch = appResource.search;

    if (!resourceSearch) {
      return;
    }

    const resourceIndex = this.meiliSearchClient.index(resourceSearch.meiliSearchIndex);

    const presenter = appResource.presenter();

    const getRecordSearchData = async (record: Record<string, any>) => {
      const searchData = await presenter.getSearchData(record);

      if (searchData === null && has(record, 'id')) {
        return {
          id: record.id,
        };
      }

      return searchData;
    };

    const recordsPresented = await parralelMap(records, getRecordSearchData);

    const updatedRecords = <Record<string, any>[]>recordsPresented.filter((record) => record !== null);

    if (updatedRecords.length > 0) {
      const updateDocumentsTask = await resourceIndex.addDocuments(
        [
          // ...
          ...updatedRecords,
        ],
        {
          primaryKey: MEILISEARCH_PRIMARY_KEY,
        },
      );

      await resourceIndex.waitForTask(updateDocumentsTask.taskUid);
    }
  }

  async performDatabaseRecordsDatesUpdate(appResource: IAppResource, records: any[]) {
    if (records.length === 0) {
      return;
    }

    await this.systemActorContext.databaseRun(async ({ entityManager }) => {
      const entity = appResource.database.getTypeormEntity();
      const getRepository = appResource.database.getTypeormRepositoryFactory();

      const repository = getRepository(entityManager) as Repository<ObjectLiteral>;

      await repository
        .createQueryBuilder()
        .update(entity)
        .set({
          dateUpdated: () => 'NOW()',
          dateSearchSync: () => 'NOW()',
        })
        .whereInIds(records.map((r) => r.id))
        .execute();
    });
  }

  private async getRecordsWithOutdatedDateSearchByAppResource(appResource: IAppResource) {
    if (!appResource.search) {
      return [];
    }

    return await this.systemActorContext.databaseRun(async ({ entityManager }) => {
      const getRepository = appResource.database.getTypeormRepositoryFactory();

      const repository = getRepository(entityManager);

      try {
        const records = await repository
          .createQueryBuilder('record')
          .select('record')
          .loadAllRelationIds({ disableMixedMap: true })
          .where('record.dateSearchSync IS NULL')
          .orWhere('record.dateSearchSync < record.dateUpdated')
          .limit(10)
          .getMany();

        return records;
      } catch (e) {
        return [];
      }
    });
  }

  private async findRecordsWithOutdatedDateSearch() {
    const findRecordsWithOutdatedDateSearchGenerator = async function* (this: MeiliSearchService) {
      for (const appResource of APP_RESOURCES) {
        let recordsWithOutdatedDateSearch: any[] = [];

        do {
          recordsWithOutdatedDateSearch = await this.getRecordsWithOutdatedDateSearchByAppResource(appResource);

          if (recordsWithOutdatedDateSearch.length > 0) {
            yield {
              appResource,
              records: recordsWithOutdatedDateSearch,
            };
          }
        } while (recordsWithOutdatedDateSearch.length > 0);
      }
    };

    return findRecordsWithOutdatedDateSearchGenerator.call(this);
  }

  private async performRecordsSync() {
    const recordsWithOutdatedDateSearch = await this.findRecordsWithOutdatedDateSearch();

    for await (const outdatedRecord of recordsWithOutdatedDateSearch) {
      const { appResource, records } = outdatedRecord;

      switch (RECORD_DELETION_MODE) {
        case RecordDeletionMode.JUST_UPDATE: {
          await this.performRecordsUpdate(appResource, records);
          await this.performDatabaseRecordsDatesUpdate(appResource, records);
          break;
        }

        case RecordDeletionMode.DELETE_FROM_SEARCH: {
          const deletedRecords = records.filter((record) => record.dateDeleted !== null);
          await this.performRecordsDelete(appResource, deletedRecords);

          const updatedRecords = records.filter((record) => record.dateDeleted === null);
          await this.performRecordsUpdate(appResource, updatedRecords);

          await this.performDatabaseRecordsDatesUpdate(appResource, records);

          break;
        }
      }
    }
  }
}
