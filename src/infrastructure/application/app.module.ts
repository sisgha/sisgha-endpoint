import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import GraphQLJSON from 'graphql-type-json';
import { AppController } from '../adapters/controllers/app.controller';
import { AppResolver } from '../adapters/resolvers/app.resolver';
import { AuthenticationModule } from '../authentication/authentication.module';
import { HttpExceptionFilter } from '../common/filter/HttpExceptionFilter';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';
import { DateScalar } from '../graphql/DateScalar';
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
    }),

    // GLOBAL MODULES

    EnvironmentConfigModule,
    DatabaseModule,
    MeiliSearchModule,

    // AUTHENTICATION MODULES
    OidcClientModule,
    AuthenticationModule,

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
