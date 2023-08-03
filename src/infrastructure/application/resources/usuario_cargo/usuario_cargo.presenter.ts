import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { UsuarioCargoModel } from '../../../../domain/models/usuario_cargo.model';

export class UsuarioCargoPresenter implements IAppResourcePresenter<UsuarioCargoModel> {
  async getSearchData() {
    return null;
  }
}
