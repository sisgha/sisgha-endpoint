import { ISearchableEntity } from '../search/ISearchableEntity';

export interface ModalidadeModel extends ISearchableEntity {
  id: number;

  // ...

  slug: string;
}
