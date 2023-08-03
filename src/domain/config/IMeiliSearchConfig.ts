export interface IMeiliSearchConfigCredentials {
  host: string;
  apiKey: string;
}

export interface IMeiliSearchConfig {
  getMeiliSearchHost(): string | undefined;

  getMeiliSearchApiKey(): string | undefined;

  getMeiliSearchConfig(): IMeiliSearchConfigCredentials;
}
