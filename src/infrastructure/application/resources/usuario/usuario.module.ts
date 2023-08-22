import { Module } from '@nestjs/common';
import { UsuarioResolver } from '../../../adapters/graphql-resolvers/usuario.resolver';
import { KcContainerModule } from '../../../kc-container/kc-container.module';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [
    // ...
    KcContainerModule,
  ],
  exports: [
    // ...
    UsuarioService,
  ],
  providers: [
    // ...
    UsuarioService,
    UsuarioResolver,
  ],
})
export class UsuarioModule {}
