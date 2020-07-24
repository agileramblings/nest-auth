// auth/auth.controller.ts
import {
    Controller,
    Get,
    Request,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  import { LoginGuard } from './guards/login.guard';
  import { Issuer } from 'openid-client';
  
  @Controller()
  export class AuthController {
  
    @UseGuards(LoginGuard)
    @Get('/login')
    login() {}
  
    @Get('/user')
    user(@Request() req) {
      return req.user
    }
    
    @UseGuards(LoginGuard)
    @Get('/callback')
    loginCallback(@Res() res: Response) {
      res.redirect('/profile');
    }
    
    @Get('/logout')
    async logout(@Request() req, @Res() res: Response) {
      const id_token = req.user ? req.user.id_token: undefined;
      req.logout();
      req.session.destroy(async (error: any) => {
        const TrustIssuer = await Issuer.discover(process.env.identityMetadata);
        const end_session_endpoint = TrustIssuer.metadata.end_session_endpoint;
        if (end_session_endpoint) {
          res.redirect(process.env.destroySessionUrl + 
            (id_token ? '&id_token_hint=' + id_token : ''));
        } else {
          res.redirect('/')
        }
      })
    }
  }