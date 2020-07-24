import { Controller, Get, Post, Request, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginGuard } from './auth/guards/login.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get('unprotected')
  unprotected() : string {
    return 'Unprotected';
  }

  @UseGuards(LoginGuard)
  @Get('start')
  start(@Request() req) {
    return req.user;
  }


  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard("oauth-bearer"))
  @Get('secured')
  securedApi(@Request() req) {
    return 'secured API';
  }
}
