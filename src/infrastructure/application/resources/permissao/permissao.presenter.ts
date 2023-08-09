import { pick } from 'lodash';
import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { PermissaoModel } from '../../../../domain/models/permissao.model';

export class PermissaoPresenter implements IAppResourcePresenter<PermissaoModel> {
  async getSearchData(data: PermissaoModel) {
    return pick(data, ['id', 'verboGlobal', 'recursoGlobal', 'descricao', 'authorizationConstraintRecipe']);
  }
}
