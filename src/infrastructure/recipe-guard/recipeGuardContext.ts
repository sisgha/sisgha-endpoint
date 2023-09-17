import { IRecipeGuardContext } from '#recipe-guard-core';
import { getAppResource } from '../application/helpers';

export const recipeGuardContext: IRecipeGuardContext<any> = {
  getAppResource: (key: string) => Promise.resolve(getAppResource(key)),
};
