import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { CursoModel } from '../../../../domain/models/curso.model';
import { CursoDbEntity } from '../../../database/entities/curso.db.entity';
import { ICursoRepository, getCursoRepository } from '../../../database/repositories/curso.repository';
import { CursoPresenter } from './curso.presenter';

export const APP_RESOURCE_CURSO = 'curso';

export type ICursoResourceDatabase = IAppResourceDatabase<typeof CursoDbEntity, ICursoRepository, DataSource | EntityManager>;

export const CursoResourceDatabase: ICursoResourceDatabase = {
  getTypeormEntity: () => CursoDbEntity,
  getTypeormRepositoryFactory: () => getCursoRepository,
};

export type ICursoResource = IAppResource<CursoModel, ICursoResourceDatabase>;

export const CursoResource: ICursoResource = {
  key: APP_RESOURCE_CURSO,

  search: {
    meiliSearchIndex: 'curso',
    searchable: [
      'id',
      //
      'nome',
      'nomeAbreviado',
      //
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
    filterable: [
      'id',
      //
      'nome',
      'nomeAbreviado',
      'modalidade.id',
      //
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
    sortable: [
      'id',
      //
      'nome',
      'nomeAbreviado',
      'modalidade.id',
      //
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
  },

  presenter: () => new CursoPresenter(),

  database: CursoResourceDatabase,
};
