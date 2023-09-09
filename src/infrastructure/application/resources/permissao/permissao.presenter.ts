import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { PermissaoModel } from '../../../../domain/models/permissao.model';

export class PermissaoPresenter implements IAppResourcePresenter<PermissaoModel> {
  async getSearchData(permissaoModel: PermissaoModel) {
    return {
      id: permissaoModel.id,

      descricao: permissaoModel.descricao,
      verboGlobal: permissaoModel.verboGlobal,
      recursoGlobal: permissaoModel.recursoGlobal,
      authorizationConstraintRecipe: permissaoModel.authorizationConstraintRecipe,

      dateCreated: permissaoModel.dateCreated,
      dateUpdated: permissaoModel.dateUpdated,
      dateDeleted: permissaoModel.dateDeleted,
      dateSearchSync: permissaoModel.dateSearchSync,
    };
  }
}
