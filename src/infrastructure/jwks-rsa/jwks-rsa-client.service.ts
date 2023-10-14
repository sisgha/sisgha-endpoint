import { Inject, Injectable } from '@nestjs/common';
import { JwksClient, SigningKey } from 'jwks-rsa';
import { LRUCache } from 'lru-cache';
import { JWKS_RSA_CLIENT_TOKEN } from './tokens/JWKS_RSA_CLIENT_TOKEN';

@Injectable()
export class JwksRSAClient {
  #c: LRUCache<any, any>;

  constructor(
    //
    @Inject(JWKS_RSA_CLIENT_TOKEN)
    private jwksClient: JwksClient,
  ) {
    this.#c = new LRUCache<any, any>({
      max: 3,
      ttl: 5 * 60 * 1000,
    });
  }

  async getSigninKeyByKid(kid: string | null): Promise<SigningKey | null> {
    try {
      if (kid) {
        const signingKey = await this.jwksClient.getSigningKey(kid);
        return signingKey;
      }
    } catch (_) {}

    return null;
  }

  async getSigninKeyPublicKeyByKid(kid: string | null): Promise<string | null> {
    const signingKey = await this.getSigninKeyByKid(kid);

    if (signingKey) {
      return signingKey.getPublicKey();
    }

    return null;
  }

  async getSigninKeyPublicKeyByKidCached(kid: string | null): Promise<string | null> {
    if (this.#c.has(kid)) {
      return this.#c.get(kid)!;
    }

    const publicKey = await this.getSigninKeyPublicKeyByKid(kid);

    if (publicKey) {
      this.#c.set(kid, publicKey);
    }

    return publicKey;
  }
}
