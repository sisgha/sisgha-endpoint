import { DataSource, EntityManager } from 'typeorm';
import { CargoDbEntity } from '../entities/cargo.db.entity';
import { UsuarioDbEntity } from '../entities/usuario.db.entity';

export type ICargoRepository = ReturnType<typeof getCargoRepository>;

export const getCargoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(CargoDbEntity).extend({
    async createQueryBuilderForUsuarioId(usuarioId: UsuarioDbEntity['id']) {
      const qb = this.createQueryBuilder('cargo')
        .select(['cargo'])
        .innerJoin('cargo.usuarioCargo', 'usuario_cargo')
        .innerJoin('usuario_cargo.usuario', 'usuario');

      qb.where('usuario.id = :usuarioId', { usuarioId: usuarioId });

      qb.cache(1000);

      return qb;
    },
  });
