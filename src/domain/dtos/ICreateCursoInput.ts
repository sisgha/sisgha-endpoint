import { FindModalidadeByIdInputType } from '../../infrastructure/application/dtos';

export type ICreateCursoInput = {
  nome: string;
  nomeAbreviado: string;
  modalidadeId: FindModalidadeByIdInputType['id'];
};
