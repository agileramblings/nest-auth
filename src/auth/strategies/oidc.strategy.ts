// src/auth/oidc.strategy.ts
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, UserinfoResponse, TokenSet, Issuer } from 'openid-client';
import { AuthService } from '../service/auth.service';

export const buildOpenIdClient = async () => {
  const TrustIssuer = await Issuer.discover(process.env.identityMetadata);
  const client = new TrustIssuer.Client({
    client_id: process.env.clientID,
    client_secret: process.env.clientSecret,
  });
  return client;
};

export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  client: Client;

  constructor(private readonly authService: AuthService, client: Client) {
    super({
      client: client,
      params: {
        redirect_uri: process.env.redirectUrl,
        scope: 'openid profile offline_access'
      },
      passReqToCallback: false,
      usePKCE: false,
    });
    this.client = client;
  }

  async validate(tokenset: TokenSet): Promise<any> {
    const userinfo: UserinfoResponse = await this.client.userinfo(tokenset);

    try {
      const id_token = tokenset.id_token
      const access_token = tokenset.access_token
      const refresh_token = tokenset.refresh_token
      const user = {
        id_token,
        access_token,
        refresh_token,
        userinfo,
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}