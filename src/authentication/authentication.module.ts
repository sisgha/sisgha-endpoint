import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from '../app/modules/usuario/usuario.module';
import { databaseProviders } from '../database/providers/database.providers';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { AuthenticatedGuard } from './guards/authenticated-guard.service';
import { oidcClientProviders } from './providers/oidc-client.providers';
import { SessionSerializer } from './serializers/session.serializer';
import { AccessTokenStrategy } from './strategies/access-token.strategy.service';

@Module({
  imports: [UsuarioModule, PassportModule.register({ defaultStrategy: 'access-token' })],

  providers: [
    ...databaseProviders,

    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },

    SessionSerializer,
    AccessTokenStrategy,

    ...oidcClientProviders,

    AuthenticationService,
    AuthenticationResolver,
  ],
  exports: [...oidcClientProviders, SessionSerializer, AuthenticationService],
})
export class AuthenticationModule {}
