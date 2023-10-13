import { ISearchableEntity } from '../search/ISearchableEntity';
import { CursoModel } from './curso.model';

export interface ModalidadeModel extends ISearchableEntity {
  id: number;

  // ...

  slug: string;
  nome: string;

  // ...

  cursos: CursoModel[];
}
