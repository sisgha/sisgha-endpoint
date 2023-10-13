import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { ModalidadeModel } from '../../../../domain/models';

export class ModalidadePresenter implements IAppResourcePresenter<ModalidadeModel> {
  async getSearchData(modalidadeModel: ModalidadeModel) {
    return {
      id: modalidadeModel.id,

      slug: modalidadeModel.slug,
      nome: modalidadeModel.nome,

      dateCreated: modalidadeModel.dateCreated,
      dateUpdated: modalidadeModel.dateUpdated,
      dateDeleted: modalidadeModel.dateDeleted,
      dateSearchSync: modalidadeModel.dateSearchSync,
    };
  }
}
