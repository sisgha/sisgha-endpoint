import { IAppResourceDatabase } from './IAppResourceDatabase';
import { IAppResourcePresenter } from './IAppResourcePresenter';
import { IAppResourceSearchOptions } from './IAppResourceSearchOptions';

export type IAppResource<
  IResourceModel = unknown,
  IResourceDatabase extends IAppResourceDatabase<any, any, any> = IAppResourceDatabase<any, any, any>,
> = {
  key: string;

  search: IAppResourceSearchOptions<IResourceModel>;

  presenter: () => IAppResourcePresenter<IResourceModel>;

  database: IResourceDatabase;
};
