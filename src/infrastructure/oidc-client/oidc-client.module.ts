import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { oidcClientProviders } from './oidc-client.providers';

@Module({
  imports: [
    // ...
    EnvironmentConfigModule,
  ],
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
