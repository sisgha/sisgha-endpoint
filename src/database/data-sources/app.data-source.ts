import { DataSource, DataSourceOptions } from 'typeorm';
import { getSharedDataSourceOptions } from '../config/getSharedDataSourceOptions';
import { getPathEntities, getPathSubscribers} from "../config/getPaths";

export const getAppDataSource = () => {
  const options = {
    ...getSharedDataSourceOptions(),

    entities: [`${getPathEntities()}/**/*{.ts,.js}`],
    subscribers: [`${getPathSubscribers()}/**/*{.ts,.js}`],
  };

  if (!options.type) {
    return null;
  }

  return new DataSource(options as DataSourceOptions);
};

const appDataSource = getAppDataSource();

export default appDataSource;
