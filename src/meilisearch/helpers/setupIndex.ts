import { isEqual } from 'lodash';
import { ErrorStatusCode, MeiliSearch } from 'meilisearch';
import { IMeiliSearchIndexDefinition } from '../interfaces/MeiliSearchIndexDefinition';

const ensureIndexExists = async (
  client: MeiliSearch,
  index: string,
): Promise<void> => {
  console.info(
    `[INFO] MeilisearchClient: ${index} -> ensuring that it exists...`,
  );

  await client.getIndex(index).catch((err) => {
    if (err.code === ErrorStatusCode.INDEX_NOT_FOUND) {
      console.info(`[INFO] MeilisearchClient: ${index} -> creating index...`);

      return client
        .createIndex(index, { primaryKey: 'id' })
        .then((task) => client.waitForTask(task.taskUid));
    }
  });

  console.info('[INFO] done');
};

const ensureSearchable = async (
  client: MeiliSearch,
  index: string,
  searchable: string[],
) => {
  const currentSearchable = await client.index(index).getSearchableAttributes();

  if (!isEqual(currentSearchable, searchable)) {
    console.info(
      `[INFO] MeilisearchClient: ${index} -> updateSearchableAttributes(${searchable})`,
    );

    await client
      .index(index)
      .updateSearchableAttributes(searchable)
      .then((task) => client.waitForTask(task.taskUid));

    console.info('[INFO] done');
  }
};

const ensureFilterable = async (
  client: MeiliSearch,
  index: string,
  filterable: string[],
) => {
  const currentFilterable = await client.index(index).getFilterableAttributes();

  if (!isEqual(currentFilterable, filterable)) {
    console.info(
      `[INFO] MeilisearchClient: ${index} -> updateFilterableAttributes(${filterable})`,
    );

    await client
      .index(index)
      .updateFilterableAttributes(filterable)
      .then((task) => client.waitForTask(task.taskUid));

    console.info('[INFO] done');
  }
};

export const ensureSortable = async (
  client: MeiliSearch,
  index: string,
  sortable: string[],
) => {
  const currentSortable = await client.index(index).getSortableAttributes();

  if (!isEqual(currentSortable, sortable)) {
    console.info(
      `[INFO] MeilisearchClient: ${index} -> updateSortableAttributes(${sortable})`,
    );

    await client
      .index(index)
      .updateSortableAttributes(sortable)
      .then((task) => client.waitForTask(task.taskUid));

    console.info('[INFO] done');
  }
};

export const setupIndex = async (
  client: MeiliSearch,
  setupIndex: IMeiliSearchIndexDefinition,
) => {
  const { filterable, index, searchable, sortable } = setupIndex;

  await ensureIndexExists(client, index);
  await ensureSearchable(client, index, searchable);
  await ensureFilterable(client, index, filterable);
  await ensureSortable(client, index, sortable);
};
