import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../infrastructure/auth/auth.module';
import { IS_PRODUCTION_MODE } from '../infrastructure/consts/IS_PRODUCTION_MODE.const';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { DateScalar } from '../infrastructure/graphql/DateScalar';
import { HttpExceptionFilter } from '../infrastructure/graphql/HttpExceptionFilter';
import { AppResolver } from './app.resolver';
import { AulaModule } from './modules/aula/aula.module';
import { CargoModule } from './modules/cargo/cargo.module';
import { CursoModule } from './modules/curso/curso.module';
import { DiaSemanaModule } from './modules/dia-semana/dia-semana.module';
import { DiarioProfessorModule } from './modules/diario-professor/diario-professor.module';
import { DiarioModule } from './modules/diario/diario.module';
import { DisciplinaCursoModule } from './modules/disciplina-curso/disciplina-curso.module';
import { DisciplinaModule } from './modules/disciplina/disciplina.module';
import { LugarModule } from './modules/lugar/lugar.module';
import { PeriodoDiaModule } from './modules/periodo-dia/periodo-dia.module';
import { ProfessorModule } from './modules/professor/professor.module';
import { SemanaModule } from './modules/semana/semana.module';
import { TurmaHasTurnoAulaModule } from './modules/turma-has-turno-aula/turma-has-turno-aula.module';
import { TurmaModule } from './modules/turma/turma.module';
import { TurnoAulaModule } from './modules/turno-aula/turno-aula.module';
import { UsuarioHasCargoModule } from './modules/usuario-has-cargo/usuario-has-cargo.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      playground: true,
      introspection: true,

      debug: !IS_PRODUCTION_MODE,
      autoSchemaFile: true,

      // resolvers: { JSON: GraphQLJSON },
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    DatabaseModule,
    AuthModule,

    //

    UsuarioModule,
    CargoModule,
    UsuarioHasCargoModule,

    //

    LugarModule,

    DiaSemanaModule,
    PeriodoDiaModule,
    TurnoAulaModule,

    SemanaModule,
    CursoModule,

    DisciplinaModule,
    DisciplinaCursoModule,

    ProfessorModule,

    TurmaModule,

    TurmaHasTurnoAulaModule,

    DiarioModule,
    DiarioProfessorModule,

    //

    AulaModule,
  ],

  controllers: [],

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
