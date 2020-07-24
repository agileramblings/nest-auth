import { BearerStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ValidationPipe, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'oauth-bearer')
{
  constructor()
  {
    super({
      identityMetadata: process.env.identityMetadata,
      clientID: process.env.clientID,
      validateIssuer: process.env.validateIssuer,
      issuer: false,
      passReqToCallback: process.env.passReqToCallback,
      isB2C: process.env.isB2C,
      policyName: process.env.policyName,
      allowMultiAudiencesInToken: process.env.allowMultiAudiencesInToken,
      audience: process.env.audience,
      loggingLevel: process.env.loggingLevel,
      loggingNoPII: process.env.loggingNoPII,
      clockSkew: process.env.clockSkew,
      scope: ['openid','profile','offline_access']
    }, (iss, sub, profile, accessToken, refreshToken, done) => {
      console.info('verifying the user');
    }
//    (token, done) => {
//      console.info('verifying the user');
//      console.info(token, 'was the token retreived');
//      findById(token.oid, function(err, user) {
//        if (err) {
//          return done(err);
//        }
//        if (!user) {
//          // "Auto-registration"
//          console.info('User was added automatically as they were new. Their oid is: ', token.oid);
//          users.push(token);
//          owner = token.oid;
//          return done(null, token);
//        }
//        owner = token.oid;
//        return done(null, user, token);
//      });
//    }
    )
  }

  async validate(request: Request){
    console.info('verifying the user');
  }
}