import { Module } from '@nestjs/common';
import { CursoResolver } from '../../../adapters/graphql-resolvers/curso.resolver';
import { ModalidadeModule } from '../modalidade/modalidade.module';
import { CursoService } from './curso.service';

@Module({
  imports: [
    // ...
    ModalidadeModule,
  ],
  exports: [
    // ...
    CursoService,
  ],
  providers: [
    // ...
    CursoService,
    CursoResolver,
  ],
})
export class CursoModule {}
