import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { PermissaoModel } from '../../../../domain/models/permissao.model';

export class PermissaoPresenter implements IAppResourcePresenter<PermissaoModel> {
  async getSearchData(data: PermissaoModel) {
    return {
      id: data.id,
      acao: data.acao,
      recurso: data.recurso,
      descricao: data.descricao,
    };
  }
}
