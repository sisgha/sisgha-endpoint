import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CursoResolver } from './curso.resolver';
import { CursoService } from './curso.service';

@Module({
  imports: [DatabaseModule],
  exports: [CursoService],
  providers: [CursoService, CursoResolver],
})
export class CursoModule {}
