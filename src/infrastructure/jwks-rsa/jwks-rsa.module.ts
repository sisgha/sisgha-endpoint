import { Module } from '@nestjs/common';
import { OidcClientModule } from '../oidc-client/oidc-client.module';
import { JwksRSAClient } from './jwks-rsa-client.service';
import { jwksRSAProviders } from './jwks-rsa.providers';

@Module({
  imports: [
    //
    OidcClientModule,
  ],
  providers: [
    // ...
    ...jwksRSAProviders,
    JwksRSAClient,
  ],
  exports: [
    // ...
    ...jwksRSAProviders,
    JwksRSAClient,
  ],
})
export class JwksModuleModule {}
