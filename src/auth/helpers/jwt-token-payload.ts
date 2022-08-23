export class JwtTokenPayload {
  sub: number;

  constructor(userId: number) {
    this.sub = userId;
  }
}
