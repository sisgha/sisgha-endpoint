import { ISearchableEntity } from '../search/ISearchableEntity';
import { ModalidadeModel } from './modalidade.model';

export interface CursoModel extends ISearchableEntity {
  id: number;

  // ...

  nome: string;
  nomeAbreviado: string;

  //

  modalidade: ModalidadeModel;
}
