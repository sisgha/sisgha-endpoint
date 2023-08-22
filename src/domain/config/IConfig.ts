import { IKeyCloakConfig } from './IKeyCloakConfig';
import { IMeiliSearchConfig } from './IMeiliSearchConfig';
import { IOIDCClientConfig } from './IOIDCClientConfig';
import { ITypeORMConfig } from './ITypeORMConfig';
import { ITypeORMDataSourceConfig } from './ITypeORMDataSourceConfig';

export interface IConfig extends IMeiliSearchConfig, ITypeORMConfig, IOIDCClientConfig, ITypeORMDataSourceConfig, IKeyCloakConfig {}
