import { IConfigKeyCloak } from './IConfigKeyCloak';
import { IConfigMeiliSearch } from './IConfigMeiliSearch';
import { IConfigOIDCClient } from './IConfigOIDCClient';
import { IConfigSeedSuperUsuario } from './IConfigSeedSuperUsuario';
import { IConfigTypeORM } from './IConfigTypeORM';
import { IConfigTypeORMDataSource } from './IConfigTypeORMDataSource';

export interface IConfig
  extends IConfigMeiliSearch,
    IConfigTypeORM,
    IConfigOIDCClient,
    IConfigTypeORMDataSource,
    IConfigKeyCloak,
    IConfigSeedSuperUsuario {}
