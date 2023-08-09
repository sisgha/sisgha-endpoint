import { APP_RESOURCES } from './app-resources';

export const getAppResource = (key: string) => {
  const targetAppResource = APP_RESOURCES.find((appResource) => appResource.key === key);
  return targetAppResource ?? null;
};
1;
