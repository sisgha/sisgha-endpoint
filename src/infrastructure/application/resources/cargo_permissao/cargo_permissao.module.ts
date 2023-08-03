import { Module } from '@nestjs/common';
import { CargoPermissaoResolver } from '../../../adapters/resolvers/cargo_permissao.resolver';
import { DatabaseModule } from '../../../database/database.module';
import { MeiliSearchModule } from '../../../meilisearch/meilisearch.module';
import { CargoModule } from '../cargo/cargo.module';
import { PermissaoModule } from '../permissao/permissao.module';
import { CargoPermissaoService } from './cargo_permissao.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    CargoModule,
    PermissaoModule,
  ],
  exports: [CargoPermissaoService],
  providers: [CargoPermissaoService, CargoPermissaoResolver],
})
export class CargoPermissaoModule {}
