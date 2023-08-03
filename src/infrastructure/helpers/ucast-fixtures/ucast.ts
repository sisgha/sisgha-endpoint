import { Query } from '@ucast/sql';
import { where } from './query.prototype.where';

export const patchUCastQueryPrototype = (QueryClass: typeof Query) => {
  QueryClass.prototype.where = where;
};

export const patchUCast = () => {
  patchUCastQueryPrototype(Query);
};
