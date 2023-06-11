import { Query } from '@ucast/sql';
import { where } from './query.prototype.where';

export const patchUcastQueryPrototype = (QueryClass: typeof Query) => {
  QueryClass.prototype.where = where;
};

export const patchUcast = () => {
  patchUcastQueryPrototype(Query);
};
