import { Module } from '@nestjs/common';
import { PermissaoResolver } from '../../../adapters/graphql-resolvers/permissao.resolver';
import { PermissaoService } from './permissao.service';

@Module({
  exports: [PermissaoService],
  providers: [PermissaoService, PermissaoResolver],
})
export class PermissaoModule {}
