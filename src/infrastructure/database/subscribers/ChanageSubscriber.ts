import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import emitter from '../../events/emitter';

@EventSubscriber()
export class ChangeSubscriber implements EntitySubscriberInterface<any> {
  afterInsert(): void | Promise<any> {
    emitter.emit('change-subscriber.event.insert');
  }

  afterUpdate(): void | Promise<any> {
    emitter.emit('change-subscriber.event.update');
  }

  afterRemove(): void | Promise<any> {
    emitter.emit('change-subscriber.event.remove');
  }
}
