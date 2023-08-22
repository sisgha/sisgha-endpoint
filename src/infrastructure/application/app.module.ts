import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { AppResolver } from '../adapters/graphql-resolvers/app.resolver';
import { AppController } from '../adapters/http-controllers/app.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { HttpExceptionFilter } from '../common/filter/HttpExceptionFilter';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';
import { IValidationFailedExceptionResponse, ValidationFailedException } from '../exceptions';
import { DateScalar } from '../graphql/DateScalar';
import { KcContainerModule } from '../kc-container/kc-container.module';
import { MeiliSearchModule } from '../meilisearch/meilisearch.module';
import { OidcClientModule } from '../oidc-client/oidc-client.module';
import { CargoModule } from './resources/cargo/cargo.module';
import { CargoPermissaoModule } from './resources/cargo_permissao/cargo_permissao.module';
import { PermissaoModule } from './resources/permissao/permissao.module';
import { UsuarioModule } from './resources/usuario/usuario.module';
import { UsuarioCargoModule } from './resources/usuario_cargo/usuario_cargo.module';
import { UsuarioInternoModule } from './resources/usuario_interno/usuario_interno.module';
import { UsuarioInternoCargoModule } from './resources/usuario_interno_cargo/usuario_interno_cargo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    ScheduleModule.forRoot(),

    EventsModule.forRoot(),

    //

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      playground: true,
      introspection: true,

      autoSchemaFile: true,

      resolvers: { JSON: GraphQLJSON },

      cache: new InMemoryLRUCache({
        // ~100MiB
        maxSize: Math.pow(2, 20) * 100,

        // 5 minutes (in milliseconds)
        ttl: 300_000,
      }),

      formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
        if (error instanceof GraphQLError) {
          const originalError = error.originalError;

          if (originalError instanceof HttpException) {
            const msg = {
              path: formattedError.path,
              message: formattedError.message,
              status: originalError.getStatus(),
            };

            if (originalError instanceof ValidationFailedException) {
              const response = <IValidationFailedExceptionResponse>originalError.getResponse();

              Object.assign(msg, {
                code: response.code,
                errors: response.errors,
              });
            }

            return msg;
          }
        }

        return {
          path: formattedError.path,
          message: formattedError.message,
        };
      },
    }),

    // GLOBAL MODULES

    EnvironmentConfigModule,
    DatabaseModule,
    MeiliSearchModule,

    // AUTHENTICATION MODULES
    OidcClientModule,
    AuthenticationModule,
    KcContainerModule,

    // APPLICATION RESOURCES

    CargoModule,
    PermissaoModule,
    CargoPermissaoModule,

    UsuarioModule,
    UsuarioCargoModule,

    UsuarioInternoModule,
    UsuarioInternoCargoModule,
  ],

  controllers: [
    // ...
    AppController,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    DateScalar,
    AppResolver,
  ],
})
export class AppModule {}
