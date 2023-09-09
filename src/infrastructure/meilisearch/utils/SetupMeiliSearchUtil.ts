import { isEqual } from 'lodash';
import { ErrorStatusCode, MeiliSearch } from 'meilisearch';
import { IAppResource } from '../../../domain/application-resources';
import { APP_RESOURCES } from '../../application/helpers';

export class SetupMeiliSearchUtil {
  async ensureIndexExists(client: MeiliSearch, index: string): Promise<void> {
    console.info(`[INFO] MeiliSearchClient: ${index} -> ensuring that it exists...`);

    await client.getIndex(index).catch((err) => {
      if (err.code === ErrorStatusCode.INDEX_NOT_FOUND) {
        console.info(`[INFO] MeiliSearchClient: ${index} -> creating index...`);

        return client.createIndex(index, { primaryKey: 'id' }).then((task) => client.waitForTask(task.taskUid));
      }
    });

    console.info('[INFO] done');
  }

  async ensureSearchable<T extends string>(client: MeiliSearch, index: string, searchable: T[]) {
    const currentSearchable = await client.index(index).getSearchableAttributes();

    if (!isEqual(currentSearchable, searchable)) {
      console.info(`[INFO] MeiliSearchClient: ${index} -> updateSearchableAttributes(${searchable})`);

      await client
        .index(index)
        .updateSearchableAttributes(searchable)
        .then((task) => client.waitForTask(task.taskUid));

      console.info('[INFO] done');
    }
  }

  async ensureFilterable<T extends string>(client: MeiliSearch, index: string, filterable: T[]) {
    const currentFilterable = await client.index(index).getFilterableAttributes();

    if (!isEqual(currentFilterable, filterable)) {
      console.info(`[INFO] MeiliSearchClient: ${index} -> updateFilterableAttributes(${filterable})`);

      await client
        .index(index)
        .updateFilterableAttributes(filterable)
        .then((task) => client.waitForTask(task.taskUid));

      console.info('[INFO] done');
    }
  }

  async ensureSortable<T extends string>(client: MeiliSearch, index: string, sortable: T[]) {
    const currentSortable = await client.index(index).getSortableAttributes();

    if (!isEqual(currentSortable, sortable)) {
      console.info(`[INFO] MeiliSearchClient: ${index} -> updateSortableAttributes(${sortable})`);

      await client
        .index(index)
        .updateSortableAttributes(sortable)
        .then((task) => client.waitForTask(task.taskUid));

      console.info('[INFO] done');
    }
  }

  async setupIndex(client: MeiliSearch, appResource: IAppResource) {
    const appResourceSearchOptions = appResource.search;

    if (appResourceSearchOptions) {
      const { filterable, meiliSearchIndex: index, searchable, sortable } = appResourceSearchOptions;

      await this.ensureIndexExists(client, index);
      await this.ensureSearchable(client, index, <any>searchable);
      await this.ensureFilterable(client, index, <any>filterable);
      await this.ensureSortable(client, index, <any>sortable);
    }
  }

  async setupInstance(client: MeiliSearch) {
    for (const appResource of APP_RESOURCES) {
      await this.setupIndex(client, appResource);
    }
  }
}
