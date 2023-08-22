import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ActorUser } from '../../actor-context/ActorUser';
import { AuthenticationService } from '../../authentication/authentication.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(readonly authService: AuthenticationService) {
    super();
  }

  async validate(accessToken?: string) {
    const user = await this.authService.validateAccessToken(accessToken);

    if (!user) {
      throw new UnauthorizedException('The provided access token is either invalid or expired.');
    }

    const actor = ActorUser.forUserEntity(user.id);

    return actor;
  }
}
