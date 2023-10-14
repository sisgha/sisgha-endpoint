import { Provider } from '@nestjs/common';
import jwksClient from 'jwks-rsa';
import { Client } from 'openid-client';
import { OPENID_CLIENT_TOKEN } from '../../oidc-client/tokens/OPENID_CLIENT_TOKEN';
import { JWKS_RSA_CLIENT_TOKEN } from '../tokens/JWKS_RSA_CLIENT_TOKEN';

export const jwksRSAClientProvider: Provider = {
  provide: JWKS_RSA_CLIENT_TOKEN,

  useFactory: async (openIDClient: Client) => {
    const jwksUri = openIDClient.issuer.metadata.jwks_uri ?? null;

    if (jwksUri) {
      const client = jwksClient({
        jwksUri: jwksUri,
        requestHeaders: {}, // Optional
        timeout: 30000, // Defaults to 30s
      });

      return client;
    } else {
      throw new Error('jwks_uri not found');
    }
  },

  inject: [OPENID_CLIENT_TOKEN],
};
