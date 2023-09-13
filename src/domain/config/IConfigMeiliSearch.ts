export interface IConfigMeiliSearchCredentials {
  host: string;
  apiKey: string;
}

export interface IConfigMeiliSearch {
  getMeiliSearchHost(): string | undefined;

  getMeiliSearchApiKey(): string | undefined;

  getMeiliSearchConfig(): IConfigMeiliSearchCredentials;
}
