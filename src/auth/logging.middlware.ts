import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';


@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor( ){};
  use(req: Request, res: Response, next: Function) {
    console.log(`Request path: ${req.originalUrl}`);
    next();
  }
}

