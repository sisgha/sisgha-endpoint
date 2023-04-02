import { join } from 'path';
export const getBasePath = () => join(__dirname, '..');

export const getPathEntities = () => join(getBasePath(), 'entities');

export const getPathSubscribers = () => join(getBasePath(), 'subscribers');

export const getPathMigrations = () => join(getBasePath(), 'migrations');

export const getPathSeeds = () => join(getBasePath(), 'seeds');
