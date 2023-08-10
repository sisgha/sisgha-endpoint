import { Module } from '@nestjs/common';
import { CargoPermissaoResolver } from '../../../adapters/graphql-resolvers/cargo_permissao.resolver';
import { CargoModule } from '../cargo/cargo.module';
import { PermissaoModule } from '../permissao/permissao.module';
import { CargoPermissaoService } from './cargo_permissao.service';

@Module({
  imports: [CargoModule, PermissaoModule],
  exports: [CargoPermissaoService],
  providers: [CargoPermissaoService, CargoPermissaoResolver],
})
export class CargoPermissaoModule {}
