export interface IKeyCloakConfigCredentials {
  baseUrl: string;
  realm: string;
  clientId: string;
  clientSecret: string;
}

export interface IKeyCloakConfig {
  getKeyCloakBaseUrl(): string | undefined;
  getKeyCloakRealm(): string | undefined;
  getKeyCloakClientId(): string | undefined;
  getKeyCloakClientSecret(): string | undefined;

  getKeyCloakConfigCredentials(): IKeyCloakConfigCredentials;
}
