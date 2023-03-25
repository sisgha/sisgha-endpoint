import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CargoModule } from '../cargo/cargo.module';
import { LugarResolver } from './lugar.resolver';
import { LugarService } from './lugar.service';

@Module({
  imports: [DatabaseModule, CargoModule],
  exports: [LugarService],
  providers: [LugarService, LugarResolver],
})
export class LugarModule {}
