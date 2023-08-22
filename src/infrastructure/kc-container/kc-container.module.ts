import { Module } from '@nestjs/common';
import { OidcClientModule } from '../oidc-client/oidc-client.module';
import { KCContainerService } from './kc-container.service';

@Module({
  imports: [
    // ...
    OidcClientModule,
  ],
  providers: [
    // ...
    KCContainerService,
  ],
  exports: [
    // ...
    KCContainerService,
  ],
})
export class KcContainerModule {}
