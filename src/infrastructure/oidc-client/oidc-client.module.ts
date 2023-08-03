import { Module } from '@nestjs/common';
import { oidcClientProviders } from './oidc-client.providers';

@Module({
  providers: [
    // ...
    ...oidcClientProviders,
  ],
  exports: [
    // ...
    ...oidcClientProviders,
  ],
})
export class OidcClientModule {}
