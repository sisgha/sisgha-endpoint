import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { LugarResolver } from './lugar.resolver';
import { LugarService } from './lugar.service';

@Module({
  imports: [DatabaseModule],
  exports: [LugarService],
  providers: [LugarService, LugarResolver],
})
export class LugarModule {}
