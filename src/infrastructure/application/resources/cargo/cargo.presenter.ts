import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { CargoModel } from '../../../../domain/models';

export class CargoPresenter implements IAppResourcePresenter<CargoModel> {
  async getSearchData(cargoModel: CargoModel) {
    return {
      id: cargoModel.id,

      slug: cargoModel.slug,

      dateCreated: cargoModel.dateCreated,
      dateUpdated: cargoModel.dateUpdated,
      dateDeleted: cargoModel.dateDeleted,
      dateSearchSync: cargoModel.dateSearchSync,
    };
  }
}
