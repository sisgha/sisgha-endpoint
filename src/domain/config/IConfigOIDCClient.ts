export interface IConfigOIDCClientCredentials {
  issuer: string;
  clientId: string;
  clientSecret: string;
}

export interface IConfigOIDCClient {
  getOIDCClientIssuer(): string | undefined;

  getOIDCClientClientId(): string | undefined;

  getOIDCClientClientSecret(): string | undefined;

  getOIDCClientCredentials(): IConfigOIDCClientCredentials;
}
