export interface IAppResourcePresenter<T> {
  getSearchData(data: T): Promise<null | Record<string, any>>;
}
