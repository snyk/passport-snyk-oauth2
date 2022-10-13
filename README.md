# @snyk/passport-snyk-oauth2

Snyk's OAuth2 strategy for [Passportjs](https://www.passportjs.org/) to make authenticating Snyk Apps a seamless experience. 

# Intro

We recently launched [Snyk Apps](https://docs.snyk.io/features/integrations/snyk-apps) which allows developers to create their own apps for Snyk and extend the functionality of the Snyk platform. It is available for all languages or framework of your choice. 

We used [Node.js](https://nodejs.dev/) and [TypeScript](https://www.typescriptlang.org/) to demo the authentication flow and usage of [Snyk Apps](https://docs.snyk.io/features/integrations/snyk-apps) using our [Snyk App Demo](https://github.com/snyk/snyk-apps-demo). 

In the [Snyk App Demo](https://github.com/snyk/snyk-apps-demo) we use [Passportjs](https://www.passportjs.org/) to make the authentication flow and implementation of the same easier for the user. To further extend this, we have created `@snyk/passport-snyk-oauth2`. This can be easily integrated with [Passportjs](https://www.passportjs.org/) and make your developer experience even better.

# Usage

## Install

```shell
npm install @snyk/passport-snyk-oauth2
```
or
```shell
yarn add @snyk/passport-snyk-oauth2
```

## Configure Strategy

```typescript
import axios from 'axios';
import passport from 'passport';
import SnykOAuth2Strategy from '@snyk/passport-snyk-oauth2';

/**
 * User can pass their own implementation of fetching the profile
 * by providing the profileFunc implementation. Snyk OAuth2 strategy
 * will call this function to fetch the profile associated with request
 */
const profileFunc: ProfileFunc = function (accessToken: string) {
    return axios.get('https://api.dev.snyk.io/v1/user/me', {
      headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `bearer ${accessToken}` },
    });
};

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
        profileFunc: fetchProfile,
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
```

## Authentication Requests

```typescript
import express from 'express';
const app = express();

/**
 * Important to pass nonce value in authenticate options.
 * Otherwise strategy will throw an error as it is a requirement.
 * 
 * You can also pass any query parameter you would like to be
 * appended to the request URL.
 */
app.get('/auth', passport.authenticate('snyk-oauth2', {
        state: 'test',
        nonce: testData.nonce
      } as passport.AuthenticateOptions));

app.get(
    '/callback',
    passport.authenticate('snyk-oauth2', {
      successRedirect: '/callback/success',
      failureRedirect: '/callback/failure',
    }),
  );
app.get('/callback/success', (req, res) => {
    return res.send('Authenticated successfull');
  });

app.get('/callback/failure', (req, res) => {
    return res.send('Authentication failed');
  });
```
