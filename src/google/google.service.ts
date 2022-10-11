import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { isUndefined } from 'lodash';

interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  email: string;
}

@Injectable()
export class GoogleService {
  private readonly oauthClient: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oauthClient = new google.auth.OAuth2(
      configService.get('GOOGLE_CLIENT_ID'),
      configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async getTokenInfo(code: string): Promise<TokenInfo> {
    const { tokens } = await this.oauthClient.getToken({
      code,
      redirect_uri: this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    });
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: tokens.id_token ?? '',
    });
    const payload = loginTicket.getPayload();

    if (
      !tokens.access_token ||
      !tokens.refresh_token ||
      !payload ||
      isUndefined(payload.email)
    ) {
      throw new ForbiddenException();
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      email: payload.email,
    };
  }
}
