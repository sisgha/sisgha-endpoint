import { pick } from 'lodash';
import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { PermissaoModel } from '../../../../domain/models/permissao.model';

export class PermissaoPresenter implements IAppResourcePresenter<PermissaoModel> {
  async getSearchData(permissaoModel: PermissaoModel) {
    return pick(permissaoModel, [
      //
      'id',

      'verboGlobal',
      'recursoGlobal',
      'descricao',
      'authorizationConstraintRecipe',

      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ]);
  }
}
