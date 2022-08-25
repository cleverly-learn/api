import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'auth/strategies/local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RefreshToken } from 'auth/entities/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: +configService.get('JWT_EXPIRES_IN') },
      }),
    }),
    PassportModule.register({ property: 'userId' }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
