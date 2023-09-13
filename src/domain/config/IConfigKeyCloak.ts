export interface IConfigKeyCloakCredentials {
  baseUrl: string;
  realm: string;
  clientId: string;
  clientSecret: string;
}

export interface IConfigKeyCloak {
  getKeyCloakBaseUrl(): string | undefined;
  getKeyCloakRealm(): string | undefined;
  getKeyCloakClientId(): string | undefined;
  getKeyCloakClientSecret(): string | undefined;

  getKeyCloakConfigCredentials(): IConfigKeyCloakCredentials;
}
