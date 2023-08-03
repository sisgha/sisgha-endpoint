import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { UsuarioInternoCargoModel } from '../../../../domain/models/usuario_interno_cargo.model';

export class UsuarioInternoCargoPresenter implements IAppResourcePresenter<UsuarioInternoCargoModel> {
  async getSearchData() {
    return null;
  }
}
