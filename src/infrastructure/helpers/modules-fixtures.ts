import type KcAdminClient from '@keycloak/keycloak-admin-client';
import type Helmet from 'helmet';
import inclusion from 'inclusion';
import type pMap from 'p-map';

// START p-map module

type IPMap = typeof pMap;

export const getPMap = (): Promise<IPMap> => inclusion('p-map').then((mod) => mod.default);

// END p-map module

// START helmet module

type IHelmet = typeof Helmet;

export const getHelmet = (): Promise<IHelmet> => inclusion('helmet').then((mod) => mod.default);

// END helmet module

// START @keycloak/keycloak-admin-client module

type IKcAdminClient = typeof KcAdminClient;

export const getKeycloakAdminClient = (): Promise<IKcAdminClient> =>
  inclusion('@keycloak/keycloak-admin-client').then((mod) => mod.default);

// END @keycloak/keycloak-admin-client module
