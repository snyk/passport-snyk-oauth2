/**
 * Helper function to test passport strategy
 * with express app. We are using supertest
 * to replicate express app's flow
 */
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

/**
 * Data required fro Snyk OAuth2 Strategy.
 * It is used in other places, so stored in
 * a separate constant.
 */
export const testData = {
  authorizationURL: 'https://example_authorization.com/authorize',
  tokenURL: 'https://example_token.com/token',
  clientID: 'test',
  clientSecret: 'test',
  callbackURL: 'https://example_callback.com',
  scope: 'apps:beta',
  nonce: 'some_nonce_value',
  tenantId: uuidv4(),
};

/**
 * Set up of app and passport as a middleware
 * for that express app.
 * @returns express application instance
 */
export function setupExpressApp(): Application {
  // Express app
  const app = express();
  app.use(express.json());
  // Session is required for state verification as
  // passport stores the state in session
  app.use(expressSession({ secret: uuidv4(), resave: false, saveUninitialized: true }));
  // Initiate passport to use the Snyk OAuth Strategy
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
      },
      // Callback function called with the
      // data fetched as part of authentication
      async function (
        req: Request,
        access_token: string,
        refresh_token: string,
        params: Params,
        profile: any,
        done: any,
      ) {
        // Notify passport that all work, like storing
        // of data in DB has been completed
        done(null, 'Done!');
      },
    ),
  );
  // Use passport as middleware for express app
  app.use(passport.initialize());
  app.use(passport.session());
  // Not required for testing, but for example purposes
  // saving the profile in session
  passport.serializeUser((profile: Express.User, done) => {
    done(null, profile);
  });
  passport.deserializeUser((profile: Express.User, done) => {
    done(null, profile);
  });
  return app;
}
