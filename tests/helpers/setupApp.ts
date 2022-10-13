/**
 * Helper function to test passport strategy
 * with express app. We are using supertest
 * to replicate express app's flow
 */
import express from 'express';
import type { Application } from 'express';
import passport from 'passport';
import expressSession from 'express-session';
import { v4 as uuidv4 } from 'uuid';

/**
 * Set up of app and passport as a middleware
 * for that express app.
 * @returns express application instance
 */
export function setupExpressApp(strategy: passport.Strategy): Application {
  // Express app
  const app = express();
  app.use(express.json());
  // Session is required for state verification as
  // passport stores the state in session
  app.use(expressSession({ secret: uuidv4(), resave: false, saveUninitialized: true }));
  // Initiate passport to use the Snyk OAuth Strategy
  passport.use(strategy);
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
