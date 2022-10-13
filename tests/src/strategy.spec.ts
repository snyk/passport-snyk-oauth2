/**
 * Since we are inheriting the passport OAuth2 strategy
 * with very little code change. Most of the test cases
 * are already covered.
 */
import { testData, setupExpressApp } from '../helpers/setupApp';
import supertest from 'supertest';
import passport from 'passport';
import SnykOAuth2Strategy from '../../src';

describe('Snyk OAuth2 strategy integration test with express', () => {
  const app = setupExpressApp();
  const request = supertest(app);

  beforeAll(() => {
    app.get(
      '/auth',
      passport.authenticate('snyk-oauth2', {
        state: 'test',
        nonce: testData.nonce,
        tenant_id: testData.tenantId,
      } as passport.AuthenticateOptions),
    );
    app.get(
      '/callback',
      passport.authenticate('snyk-oauth2', {
        successRedirect: '/callback/success',
        failureRedirect: '/callback/failure',
      }),
    );
    app.get('/callback/success', (req, res) => {
      return res.send('Test passed');
    });
    app.get('/callback/failure', (req, res) => {
      return res.send('Test failed');
    });
  });

  it('should redirect for authorization', async () => {
    // Action
    // Trigger the auth flow
    const response = await request.get('/auth');

    // Assert
    expect(response.statusCode).toBe(302);
    const redirectURL = new URL(response.header.location);
    expect(`${redirectURL.origin}${redirectURL.pathname}`).toBe(testData.authorizationURL);
    // All the query parameters
    expect(redirectURL.searchParams.get('nonce')).toBe(testData.nonce);
    expect(redirectURL.searchParams.get('response_type')).toBe('code');
    // eslint-disable-next-line spellcheck/spell-checker
    expect(redirectURL.searchParams.get('redirect_uri')).toBe(testData.callbackURL);
    expect(redirectURL.searchParams.get('scope')).toBe(testData.scope);
    expect(redirectURL.searchParams.get('client_id')).toBe(testData.clientID);
    expect(redirectURL.searchParams.get('tenant_id')).toBe(testData.tenantId);
  });

  it('should call the failure mock when not authenticated', async () => {
    // Action
    await request.get('/auth');
    const responseTwo = await request.get(`/callback?code=${1234}&scope=apps%3Abeta&state=test`);
    // Assert
    expect(responseTwo.statusCode).toBe(302);
    expect(responseTwo.header.location).toBe('/callback/failure');
  });
});

describe('SnykOAuth2 strategy unit tests', () => {
  const strategy = new SnykOAuth2Strategy(
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
    (done: any) => {
      done(null, 'Done!');
    },
  );

  describe('authorizationParams', () => {
    it('should throw error when auth params called with undefined', () => {
      const action = () => {
        strategy.authorizationParams(undefined);
      };
      expect(action).toThrow(
        new Error('Nonce value required, pass it in options for passport.authenticate function call.'),
      );
    });

    it('should throw error when auth params called with object with no nonce value', () => {
      const action = () => {
        strategy.authorizationParams({ test: 'test' });
      };
      expect(action).toThrow(
        new Error('Nonce value required, pass it in options for passport.authenticate function call.'),
      );
    });

    it('should not throw error when auth params called with object with nonce value', () => {
      const action = () => {
        strategy.authorizationParams({ nonce: 'test' });
      };
      expect(action).not.toThrowError();
    });
  });

  describe('tokenParams', () => {
    it('should throw error when token params called with undefined', () => {
      const action = () => {
        strategy.tokenParams(undefined);
      };
      expect(action).toThrow(
        new Error('Nonce value required, pass it in options for passport.authenticate function call.'),
      );
    });

    it('should throw error when token params called with object with no nonce value', () => {
      const action = () => {
        strategy.tokenParams({ test: 'test' });
      };
      expect(action).toThrow(
        new Error('Nonce value required, pass it in options for passport.authenticate function call.'),
      );
    });

    it('should not throw error when token params called with object with nonce value', () => {
      const action = () => {
        strategy.tokenParams({ nonce: 'test' });
      };
      expect(action).not.toThrowError();
    });
  });
});
