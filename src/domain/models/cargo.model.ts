import { ISearchableEntity } from '../search/ISearchableEntity';

export interface CargoModel extends ISearchableEntity {
  id: number;

  // ...

  slug: string;
}
