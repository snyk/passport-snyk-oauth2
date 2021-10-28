import express from 'express';
import type { Request, Application } from 'express';
import passport from 'passport';
import SnykOAuth2Strategy from '../../src';
import expressSession from 'express-session';
import { v4 as uuidv4 } from 'uuid';

type Params = {
  expires_in: number;
  scope: string;
  token_type: string;
};

export const testData = {
  authorizationURL: 'https://example_authorization.com/authorize',
  tokenURL: 'https://example_token.com/token',
  clientID: 'test',
  clientSecret: 'test',
  callbackURL: 'https://example_callback.com',
  scope: 'apps:beta',
  nonce: 'some_nonce_value',
};

export function setupExpressApp(): Application {
  const app = express();
  app.use(express.json());
  app.use(expressSession({ secret: uuidv4(), resave: false, saveUninitialized: true }));
  passport.use(
    new SnykOAuth2Strategy(
      {
        authorizationURL: testData.authorizationURL,
        tokenURL: testData.tokenURL,
        clientID: testData.clientID,
        clientSecret: testData.clientSecret,
        callbackURL: testData.callbackURL,
        scope: testData.scope,
        scopeSeparator: ' ',
        state: true,
        passReqToCallback: true,
        nonce: testData.nonce,
        // profileFunc,
      },
      async function (
        req: Request,
        access_token: string,
        refresh_token: string,
        params: Params,
        profile: any,
        done: any,
      ) {
        done(null, 'Done!');
      },
    ),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user: Express.User, done) => {
    done(null, user);
  });
  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });
  return app;
}
