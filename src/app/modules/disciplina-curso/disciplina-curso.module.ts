import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { CursoModule } from '../curso/curso.module';
import { DisciplinaModule } from '../disciplina/disciplina.module';
import { DisciplinaCursoResolver } from './disciplina-curso.resolver';
import { DisciplinaCursoService } from './disciplina-curso.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    DisciplinaModule,
    CursoModule,
  ],
  exports: [DisciplinaCursoService],
  providers: [DisciplinaCursoService, DisciplinaCursoResolver],
})
export class DisciplinaCursoModule {}
