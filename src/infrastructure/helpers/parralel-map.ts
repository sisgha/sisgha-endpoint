import { getPMap } from 'src/infrastructure/helpers/modules-fixtures';

export const parralelMap = async <T, R>(items: T[], mapper: (item: T) => Promise<R>, concurrency = 4): Promise<R[]> => {
  const pMap = await getPMap();
  return pMap(items, mapper, { concurrency });
};
