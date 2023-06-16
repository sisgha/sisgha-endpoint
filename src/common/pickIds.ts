import { get } from 'lodash';

export const pickIds = <T extends { id: unknown }>(arr: T[]) => arr.map((i) => get(i, 'id'));
