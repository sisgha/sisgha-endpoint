import type KcAdminClient from '@keycloak/keycloak-admin-client';
import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { getKeycloakAdminClient } from '../helpers/modules-fixtures';

const INTERVAL_AUTH = 58 * 1000;

@Injectable()
export class KCContainerService {
  kcAdminClient: KcAdminClient | null = null;

  #authInterval: NodeJS.Timer | null = null;

  #initialized = false;

  constructor(private environmentConfigService: EnvironmentConfigService) {}

  private getConfigCredentials() {
    return this.environmentConfigService.getKeyCloakConfigCredentials();
  }

  private getAuthCredentials() {
    const config = this.getConfigCredentials();

    const credentials: Credentials = {
      grantType: 'client_credentials',
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    };

    return credentials;
  }

  async clearAuthInterval() {
    if (this.#authInterval !== null) {
      clearInterval(this.#authInterval);
      this.#authInterval = null;
    }
  }

  async setupAuthInterval() {
    await this.clearAuthInterval();

    this.#authInterval = setInterval(() => {
      this.authenticate();
    }, INTERVAL_AUTH);
  }

  async setup() {
    if (!this.#initialized) {
      this.#initialized = true;

      const KcAdminClient = await getKeycloakAdminClient();

      const config = this.getConfigCredentials();

      this.kcAdminClient = new KcAdminClient({
        baseUrl: config.baseUrl,
        realmName: config.realm,
      });

      await this.authenticate();
      await this.setupAuthInterval();
    }
  }

  async authenticate() {
    const config = this.getConfigCredentials();

    const kcAdminClient = this.kcAdminClient;

    if (kcAdminClient) {
      const currentRealm = kcAdminClient.realmName;

      kcAdminClient.setConfig({ realmName: config.realm });

      const credentials = this.getAuthCredentials();

      try {
        await kcAdminClient.auth(credentials);
      } catch (e) {
        console.error('Can not connect to KeyCloak.');
        throw e;
      } finally {
        kcAdminClient.setConfig({ realmName: currentRealm });
      }
    }
  }

  async getAdminClient() {
    await this.setup();

    const kcAdminClient = this.kcAdminClient;

    if (kcAdminClient) {
      return kcAdminClient;
    }

    throw new InternalServerErrorException('kcAdminClient is null');
  }
}
