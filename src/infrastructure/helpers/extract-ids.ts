import { get } from 'lodash';

export const extractIds = <T extends { id: unknown }>(arr: T[]) => arr.map((i) => get(i, 'id'));
