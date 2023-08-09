export interface IOIDCClientConfigCredentials {
  issuer: string;
  clientId: string;
  clientSecret: string;
}

export interface IOIDCClientConfig {
  getOIDCClientIssuer(): string | undefined;

  getOIDCClientClientId(): string | undefined;

  getOIDCClientClientSecret(): string | undefined;

  getOIDCClientCredentials(): IOIDCClientConfigCredentials;
}
