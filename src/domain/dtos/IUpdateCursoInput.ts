import { FindModalidadeByIdInputType } from '../../infrastructure/application/dtos';

export type IUpdateCursoInput = {
  id: number;

  nome?: string;
  nomeAbreviado?: string;

  modalidadeId?: FindModalidadeByIdInputType['id'];
};
