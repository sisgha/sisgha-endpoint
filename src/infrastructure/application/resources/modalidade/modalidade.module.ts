import { Module } from '@nestjs/common';
import { ModalidadeResolver } from '../../../adapters/graphql-resolvers/modalidade.resolver';
import { ModalidadeService } from './modalidade.service';

@Module({
  exports: [
    // ...
    ModalidadeService,
  ],
  providers: [
    // ...
    ModalidadeService,
    ModalidadeResolver,
  ],
})
export class ModalidadeModule {}
