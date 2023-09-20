import { NestFactory } from '@nestjs/core';
import { DataSource, MigrationInterface, QueryRunner } from 'typeorm';
import { IAppResource } from '../../../domain/application-resources';
import { ActorContext } from '../../actor-context/ActorContext';
import { AppModule } from '../../application/app.module';
import { UsuarioResource } from '../../application/resources/usuario/usuario.resource';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { KCClientService } from '../../kc-container/kc-client.service';
import { MeiliSearchService } from '../../meilisearch/meilisearch.service';
import { UsuarioDbEntity } from '../entities/usuario.db.entity';
import { UsuarioCargoDbEntity } from '../entities/usuario_cargo.db.entity';
import { getCargoRepository } from '../repositories/cargo.repository';
import { getUsuarioRepository } from '../repositories/usuario.repository';
import { getUsuarioCargoRepository } from '../repositories/usuario_cargo.repository';
import { APP_DATA_SOURCE_TOKEN } from '../tokens/APP_DATA_SOURCE_TOKEN';

const SEED_SUPER_USUARIO_NOME = 'Super Usuário';

export class SuperUsuario1694543412145 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //

    const app = await NestFactory.create(AppModule);

    //

    const dataSource = app.get<DataSource>(APP_DATA_SOURCE_TOKEN);
    const actorContext = ActorContext.forSystem(dataSource);
    const environmentConfigService = app.get(EnvironmentConfigService);

    //

    const configSuperUsuario = environmentConfigService.getSeedSuperUsuario();

    //

    const usuarioRepository = getUsuarioRepository(queryRunner.manager);

    const usuario = <UsuarioDbEntity>{
      keycloakId: null,
      email: configSuperUsuario.email,
      matriculaSiape: configSuperUsuario.matriculaSiape,
      nome: SEED_SUPER_USUARIO_NOME,
      flagSeedSuperUsuario: true,
    };

    await usuarioRepository.save(usuario);

    //

    const cargoRepository = getCargoRepository(queryRunner.manager);

    const cargoSistema = await cargoRepository.findOneOrFail({
      where: {
        slug: 'sistema',
      },
      select: ['id'],
    });

    const usuarioCargoRepository = getUsuarioCargoRepository(queryRunner.manager);

    await usuarioCargoRepository.save(<UsuarioCargoDbEntity>{
      cargo: {
        id: cargoSistema.id,
      },
      usuario: {
        id: usuario.id,
      },
    });

    //

    const kcClientService = app.get(KCClientService);

    const kcUser = await kcClientService.createUser(actorContext, {
      nome: SEED_SUPER_USUARIO_NOME,
      email: configSuperUsuario.email,
      matriculaSiape: configSuperUsuario.matriculaSiape,
    });

    usuario.keycloakId = kcUser.id;

    await usuarioRepository.save(usuario);

    //

    await kcClientService.updateUserPassword(
      actorContext,
      kcUser.id,
      {
        currentPassword: '',
        newPassword: configSuperUsuario.password,
        confirmNewPassword: configSuperUsuario.password,
      },
      false,
    );

    //

    await app.close();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //

    const app = await NestFactory.create(AppModule);

    //

    const dataSource = app.get<DataSource>(APP_DATA_SOURCE_TOKEN);
    const actorContext = ActorContext.forSystem(dataSource);

    //

    const kcClientService = app.get(KCClientService);
    const meilisearchService = app.get(MeiliSearchService);
    const usuarioRepository = getUsuarioRepository(queryRunner.manager);

    //

    const superUsuarios = await usuarioRepository.find({
      where: {
        flagSeedSuperUsuario: true,
      },
    });

    for (const superUsuario of superUsuarios) {
      await meilisearchService.performRecordsDelete(<IAppResource>UsuarioResource, [superUsuario]);

      const keycloakId = superUsuario.keycloakId;

      if (keycloakId) {
        await kcClientService.deleteUser(actorContext, keycloakId);
      }

      await usuarioRepository.delete(superUsuario.id);
    }

    await app.close();
  }
}
