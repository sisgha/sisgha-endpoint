import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { UsuarioModel } from '../../../../domain/models/usuario.model';

export class UsuarioPresenter implements IAppResourcePresenter<UsuarioModel> {
  async getSearchData(usuarioModel: UsuarioModel) {
    return {
      id: usuarioModel.id,

      nome: usuarioModel.nome,

      email: usuarioModel.email,
      matriculaSiape: usuarioModel.matriculaSiape,

      dateCreated: usuarioModel.dateCreated,
      dateUpdated: usuarioModel.dateUpdated,
      dateDeleted: usuarioModel.dateDeleted,
      dateSearchSync: usuarioModel.dateSearchSync,
    };
  }
}
