import type Helmet from 'helmet';
import inclusion from 'inclusion';
import type pMap from 'p-map';

type IHelmet = typeof Helmet;
type IPMap = typeof pMap;

// START p-map module

export const getPMap = (): Promise<IPMap> =>
  inclusion('p-map').then((mod) => mod.default);

// END p-map module

// START helmet module

export const getHelmet = (): Promise<IHelmet> =>
  inclusion('helmet').then((mod) => mod.default);

// END helmet module
