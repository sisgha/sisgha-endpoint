import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { UsuarioInternoModel } from '../../../../domain/models/usuario_interno.model';

export class UsuarioInternoPresenter implements IAppResourcePresenter<UsuarioInternoModel> {
  async getSearchData(usuarioInternoModel: UsuarioInternoModel) {
    return {
      id: usuarioInternoModel.id,

      tipoEntidade: usuarioInternoModel.tipoEntidade,

      dateCreated: usuarioInternoModel.dateCreated,
      dateUpdated: usuarioInternoModel.dateUpdated,
      dateDeleted: usuarioInternoModel.dateDeleted,
      dateSearchSync: usuarioInternoModel.dateSearchSync,
    };
  }
}
