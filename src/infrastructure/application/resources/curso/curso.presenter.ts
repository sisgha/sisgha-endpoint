import { IAppResourcePresenter } from '../../../../domain/application-resources';
import { CursoModel } from '../../../../domain/models/curso.model';

export class CursoPresenter implements IAppResourcePresenter<CursoModel> {
  async getSearchData(model: CursoModel) {
    return {
      id: model.id,

      //

      nome: model.nome,
      nomeAbreviado: model.nomeAbreviado,

      modalidade: {
        id: model.modalidade.id,
      },

      //

      dateCreated: model.dateCreated,
      dateUpdated: model.dateUpdated,
      dateDeleted: model.dateDeleted,
      dateSearchSync: model.dateSearchSync,
    };
  }
}
