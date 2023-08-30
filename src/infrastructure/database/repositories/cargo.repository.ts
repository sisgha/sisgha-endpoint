import { DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { CargoDbEntity } from '../entities/cargo.db.entity';
import { UsuarioDbEntity } from '../entities/usuario.db.entity';
import { UsuarioInternoDbEntity } from '../entities/usuario_interno.db.entity';

export type ICargoRepository = ReturnType<typeof getCargoRepository>;

export const getCargoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(CargoDbEntity).extend({
    async createQueryBuilderForUsuarioId(usuarioId: UsuarioDbEntity['id']) {
      const qb = this.createQueryBuilder('cargo')
        .select(['cargo'])
        .innerJoin('cargo.usuarioCargo', 'usuario_cargo')
        .innerJoin('usuario_cargo.usuario', 'usuario');

      qb.where('usuario.id = :usuarioId', { usuarioId: usuarioId });

      qb.cache(30);

      return qb;
    },

    async createQueryBuilderForUsuarioInternoId(usuarioInternoId: UsuarioInternoDbEntity['id']) {
      const qb = this.createQueryBuilder('cargo')
        .select(['cargo'])
        .innerJoin('cargo.usuarioInternoCargo', 'usuario_interno_cargo')
        .innerJoin('usuario_interno_cargo.usuarioInterno', 'usuario_interno');

      qb.where('usuario_interno.id = :usuarioInternoId', { usuarioInternoId: usuarioInternoId });

      qb.cache(30);

      return qb;
    },

    //

    async initQueryBuilder() {
      const qb = this.createQueryBuilder('cargo').select(['cargo']);
      return qb;
    },

    async filterQueryByUsuarioId(qb: SelectQueryBuilder<CargoDbEntity>, usuarioId: number) {
      qb.innerJoin('cargo.usuarioCargo', 'usuario_cargo');
      qb.innerJoin('usuario_cargo.usuario', 'usuario');

      qb.andWhere('usuario.id = :usuarioId', { usuarioId: usuarioId });

      qb.andWhere('usuario.dateDeleted IS NULL');
      qb.andWhere('cargo.dateDeleted IS NULL');

      return qb;
    },

    async createQueryBuilderByUsuarioId(usuarioId: number) {
      const qb = await this.initQueryBuilder();
      await this.filterQueryByUsuarioId(qb, usuarioId);
      return qb;
    },
  });
