import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { CargoPermissaoModel } from '../../../../domain/models/cargo_permissao.model';

export class CargoPermissaoPresenter implements IAppResourcePresenter<CargoPermissaoModel> {
  async getSearchData() {
    return null;
  }
}
