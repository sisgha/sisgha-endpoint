import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { UsuarioInternoModel } from '../../../../domain/models/usuario_interno.model';

export class UsuarioInternoPresenter implements IAppResourcePresenter<UsuarioInternoModel> {
  async getSearchData(data: UsuarioInternoModel) {
    return {
      id: data.id,
      tipoEntidade: data.tipoEntidade,
    };
  }
}
