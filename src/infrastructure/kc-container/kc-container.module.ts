import { Module } from '@nestjs/common';
import { OidcClientModule } from '../oidc-client/oidc-client.module';
import { KCClientService } from './kc-client.service';
import { KCContainerService } from './kc-container.service';

@Module({
  imports: [
    // ...
    OidcClientModule,
  ],
  providers: [
    // ...
    KCClientService,
    KCContainerService,
  ],
  exports: [
    // ...
    KCClientService,
    KCContainerService,
  ],
})
export class KcContainerModule {}
