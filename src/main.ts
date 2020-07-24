import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectMongo from 'connect-mongo';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const MongoStore = connectMongo(session);

  // Authentication & Session
  app.use(session({
    store: new MongoStore({ url: process.env.MONGODB_URL}), // where session will be stored
    secret: process.env.SESSION_SECRET, // to sign session id
    resave: false, // will default to false in near future: https://github.com/expressjs/session#resave
    saveUninitialized: false, // will default to false in near future: https://github.com/expressjs/session#saveuninitialized
    rolling: true, // keep session alive
    cookie: {
      maxAge: 30 * 60 * 1000, // session expires in 1hr, refreshed by `rolling: true` option.
      httpOnly: true, // so that cookie can't be accessed via client-side script
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
