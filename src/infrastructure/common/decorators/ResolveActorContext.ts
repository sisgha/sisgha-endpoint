import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Actor } from '../../actor-context/Actor';
import { ActorContext } from '../../actor-context/ActorContext';
import { APP_DATA_SOURCE_TOKEN } from '../../database/tokens/APP_DATA_SOURCE_TOKEN';
import { ResolveRequestActor } from './ResolveRequestActor';

@Injectable()
export class ResolveActorContextPipe implements PipeTransform {
  constructor(
    @Inject(APP_DATA_SOURCE_TOKEN)
    private dataSource: DataSource,
  ) {}

  async transform(actor: Actor /* _metadata: ArgumentMetadata */) {
    return new ActorContext(this.dataSource, actor);
  }
}

export const ResolveActorContext = (options?: any) => ResolveRequestActor(options, ResolveActorContextPipe);
