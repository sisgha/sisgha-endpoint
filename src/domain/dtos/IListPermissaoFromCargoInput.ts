import { IGenericListInput } from '../search/IGenericListInput';

export type IListPermissaoFromCargoInput = IGenericListInput & {
  cargoId: number;
};
