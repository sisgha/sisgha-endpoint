import { DynamicModule, Provider, ValueProvider } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import emitter from './emitter';

export class EventsModule {
  static forRoot(): DynamicModule {
    const eventEmitterModule = EventEmitterModule.forRoot({
      global: true,
    });

    const providers = <undefined | Provider[]>eventEmitterModule.providers?.map((provider) => {
      const provide = (<any>provider).provide;

      if (provide === EventEmitter2) {
        return <ValueProvider>{
          provide,
          useValue: emitter,
        };
      }

      return provider;
    });

    return {
      ...eventEmitterModule,
      providers,
    };
  }
}
