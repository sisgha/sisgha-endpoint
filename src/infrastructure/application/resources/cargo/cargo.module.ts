import { Module } from '@nestjs/common';
import { CargoResolver } from '../../../adapters/resolvers/cargo.resolver';
import { CargoService } from './cargo.service';

@Module({
  exports: [
    // ...
    CargoService,
  ],
  providers: [
    // ...
    CargoService,
    CargoResolver,
  ],
})
export class CargoModule {}
