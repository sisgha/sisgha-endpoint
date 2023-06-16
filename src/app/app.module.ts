import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import GraphQLJSON from 'graphql-type-json';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DatabaseModule } from '../database/database.module';
import { DateScalar } from '../graphql/DateScalar';
import { HttpExceptionFilter } from '../graphql/HttpExceptionFilter';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { CargoModule } from './modules/cargo/cargo.module';
import { CargoPermissaoModule } from './modules/cargo_permissao/cargo_permissao.module';
import { PermissaoModule } from './modules/permissao/permissao.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { UsuarioCargoModule } from './modules/usuario_cargo/usuario_cargo.module';
import { UsuarioInternoModule } from './modules/usuario_interno/usuario_interno.module';

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

    //

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      playground: true,
      introspection: true,

      autoSchemaFile: true,

      resolvers: { JSON: GraphQLJSON },
    }),

    //

    DatabaseModule,

    //

    AuthenticationModule,

    //

    MeiliSearchModule,

    //

    PermissaoModule,
    CargoModule,
    CargoPermissaoModule,
    UsuarioModule,
    UsuarioCargoModule,
    UsuarioInternoModule,
  ],

  controllers: [AppController],

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
