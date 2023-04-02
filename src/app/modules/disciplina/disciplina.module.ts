import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { LugarModule } from '../lugar/lugar.module';
import { DisciplinaResolver } from './disciplina.resolver';
import { DisciplinaService } from './disciplina.service';

@Module({
  imports: [DatabaseModule, LugarModule],
  exports: [DisciplinaService],
  providers: [DisciplinaService, DisciplinaResolver],
})
export class DisciplinaModule {}
