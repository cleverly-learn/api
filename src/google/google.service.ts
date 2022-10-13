import { ConfigService } from '@nestjs/config';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { classroom_v1, google } from 'googleapis';
import { isUndefined } from 'lodash';

interface TokenInfo {
  refreshToken: string;
  email: string;
}

@Injectable()
export class GoogleService {
  private readonly oauthClient: OAuth2Client;

  private readonly classroom: classroom_v1.Classroom;

  constructor(private readonly configService: ConfigService) {
    this.oauthClient = new google.auth.OAuth2(
      configService.get('GOOGLE_CLIENT_ID'),
      configService.get('GOOGLE_CLIENT_SECRET'),
    );
    this.classroom = google.classroom({
      version: 'v1',
      auth: this.oauthClient,
    });
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

    if (!tokens.refresh_token || !payload || isUndefined(payload.email)) {
      throw new ForbiddenException();
    }

    return {
      refreshToken: tokens.refresh_token,
      email: payload.email,
    };
  }

  async createCourse(
    { name, studentsIds }: { name: string; studentsIds: string[] },
    credentials: Credentials,
  ): Promise<classroom_v1.Schema$Course> {
    this.oauthClient.setCredentials(credentials);

    const { data: course } = await this.classroom.courses.create({
      requestBody: { name, ownerId: 'me' },
    });

    await Promise.all(
      studentsIds.map((studentId) =>
        this.classroom.invitations.create({
          requestBody: {
            courseId: course.id ?? '',
            userId: studentId,
            role: 'STUDENT',
          },
        }),
      ),
    );

    return course;
  }
}
