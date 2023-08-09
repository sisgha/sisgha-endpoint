import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { UsuarioModel } from '../../../../domain/models/usuario.model';

export class UsuarioPresenter implements IAppResourcePresenter<UsuarioModel> {
  async getSearchData(data: UsuarioModel) {
    return {
      id: data.id,
      email: data.email,
      matriculaSiape: data.matriculaSiape,
    };
  }
}
