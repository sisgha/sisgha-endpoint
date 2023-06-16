import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { CargoPermissaoService } from './cargo_permissao.service';
import { CargoPermissaoResolver } from './cargo_permissao.resolver';
import { CargoModule } from '../cargo/cargo.module';
import { PermissaoModule } from '../permissao/permissao.module';

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
