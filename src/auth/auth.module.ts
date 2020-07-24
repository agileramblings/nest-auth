import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OidcStrategy, buildOpenIdClient } from './strategies/oidc.strategy';
import { AzureADStrategy } from './strategies/aad.strategy';
import { SessionSerializer } from './service/session.serializer';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (authService: AuthService) => {
    const client = await buildOpenIdClient(); // secret sauce! build the dynamic client before injecting it into the strategy for use in the constructor super call.
    const oidcStrategy = new OidcStrategy(authService, client);
    return oidcStrategy;
  },
  inject: [AuthService]
};

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
  ],
  controllers: [AuthController],
  providers: [OidcStrategyFactory, AzureADStrategy, SessionSerializer, AuthService],
})
export class AuthModule {}