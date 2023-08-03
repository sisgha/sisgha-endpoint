import { Provider } from '@nestjs/common';
import { OPENID_CLIENT_TOKEN } from '../tokens/OPENID_CLIENT_TOKEN';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { Issuer } from 'openid-client';

export const oidcClientProvider: Provider = {
  provide: OPENID_CLIENT_TOKEN,

  useFactory: async (environmentConfigService: EnvironmentConfigService) => {
    const { issuer, clientId, clientSecret } = environmentConfigService.getOIDCClientCredentials();

    const TrustIssuer = await Issuer.discover(issuer);

    const client = new TrustIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
    });

    return client;
  },

  inject: [EnvironmentConfigService],
};
