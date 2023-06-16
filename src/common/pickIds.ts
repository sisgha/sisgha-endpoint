import { get } from 'lodash';

export const pickIds = <T extends { id: K }, K>(arr: T[]): K[] => arr.map((i) => get(i, 'id'));
