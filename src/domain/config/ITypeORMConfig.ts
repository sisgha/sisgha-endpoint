export interface ITypeORMConfig {
  getTypeORMBasePath(): string;

  getTypeORMPathEntities(): string;

  getTypeORMPathSubscribers(): string;

  getTypeORMPathMigrations(): string;

  getTypeORMPathSeeds(): string;

  getTypeORMDBConnection(): string | undefined;

  getTypeORMDBHost(): string | undefined;

  getTypeORMDBPort(): string | undefined;

  getTypeORMDBUsername(): string | undefined;

  getTypeORMDBPassword(): string | undefined;

  getTypeORMDBDatabase(): string | undefined;

  getTypeORMDBSchema(): string | undefined;

  getTypeORMLogging(): string | undefined;

  getTypeORMDBUrl(): string | undefined;

  getTypeORMDBUseSSL(): string | undefined;
}
