export type IAppResourceDatabase<IEntity, IRepository, IManager> = {
  getTypeormEntity: () => IEntity;
  getTypeormRepositoryFactory: () => (manager: IManager) => IRepository;
};
