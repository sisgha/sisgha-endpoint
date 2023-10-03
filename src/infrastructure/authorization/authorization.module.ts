import { Module } from '@nestjs/common';
import { AuthorizationResolver } from '../adapters/graphql-resolvers/authorization.resolver';
import { UsuarioModule } from '../application/resources/usuario/usuario.module';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [
    // ...
    UsuarioModule,
  ],

  providers: [
    // ...
    AuthorizationService,
    AuthorizationResolver,
  ],
  exports: [
    // ...

    AuthorizationService,
  ],
})
export class AuthorizationModule {}
