import { IActionRequestUser } from './IActionRequestUser';
import { ResourceActionRequestRole } from './ResourceActionRequestRole';

export class ResourceActionRequest {
  user?: IActionRequestUser;

  constructor(public readonly role = ResourceActionRequestRole.ANON) {}

  static forUser(userId: number) {
    const resourceActionRequest = new ResourceActionRequest(
      ResourceActionRequestRole.AUTHENTICATED,
    );

    resourceActionRequest.user = { id: userId };

    return resourceActionRequest;
  }

  static forPublicReadStrict() {
    const resourceActionRequest = new ResourceActionRequest(
      ResourceActionRequestRole.ANON,
    );

    return resourceActionRequest;
  }

  static forSystemInternalActions() {
    const resourceActionRequest = new ResourceActionRequest(
      ResourceActionRequestRole.SYSTEM,
    );

    return resourceActionRequest;
  }
}
