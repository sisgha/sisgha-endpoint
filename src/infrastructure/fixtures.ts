import type Helmet from 'helmet';

// START p-map module

export const pMapModule = import('p-map').then((mod) => mod.default);

export const getPMap = () => pMapModule;

// END p-map module

// START helmet module

type IHelmet = typeof Helmet;

const helmetModule: Promise<IHelmet> = import('helmet').then(
  (mod) => mod.default,
);

export const getHelmet = (): Promise<IHelmet> => helmetModule;

// END helmet module
