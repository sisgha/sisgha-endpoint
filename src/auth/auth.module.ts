import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from '../app/modules/usuario/usuario.module';
import { databaseProviders } from '../database/providers/database.providers';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './guards/authenticated-guard.service';
import { oidcClientProviders } from './providers/oidc-client.providers';
import { SessionSerializer } from './serializers/session.serializer';
import { AccessTokenStrategy } from './strategies/access-token.strategy.service';

@Module({
  imports: [
    UsuarioModule,
    PassportModule.register({ defaultStrategy: 'access-token' }),
  ],

  providers: [
    ...databaseProviders,

    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },

    SessionSerializer,
    AccessTokenStrategy,

    ...oidcClientProviders,

    AuthService,
    AuthResolver,
  ],
  exports: [...oidcClientProviders, SessionSerializer, AuthService],
})
export class AuthModule {}
