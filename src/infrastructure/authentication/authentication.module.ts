import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationResolver } from '../adapters/resolvers/authentication.resolver';
import { UsuarioModule } from '../application/resources/usuario/usuario.module';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { SessionSerializer } from '../common/serializers/session.serializer';
import { AccessTokenStrategy } from '../common/strategies/access-token.strategy';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { DatabaseModule } from '../database/database.module';
import { OidcClientModule } from '../oidc-client/oidc-client.module';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    // ...
    DatabaseModule,
    OidcClientModule,
    EnvironmentConfigModule,
    UsuarioModule,
    PassportModule.register({ defaultStrategy: 'access-token' }),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },

    SessionSerializer,
    AccessTokenStrategy,

    AuthenticationService,
    AuthenticationResolver,
  ],
  exports: [
    // ...
    SessionSerializer,
    AuthenticationService,
  ],
})
export class AuthenticationModule {}