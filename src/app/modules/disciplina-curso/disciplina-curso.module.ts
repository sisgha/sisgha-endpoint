import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CursoModule } from '../curso/curso.module';
import { DisciplinaModule } from '../disciplina/disciplina.module';
import { DisciplinaCursoResolver } from './disciplina-curso.resolver';
import { DisciplinaCursoService } from './disciplina-curso.service';

@Module({
  imports: [DatabaseModule, DisciplinaModule, CursoModule],
  exports: [DisciplinaCursoService],
  providers: [DisciplinaCursoService, DisciplinaCursoResolver],
})
export class DisciplinaCursoModule {}
