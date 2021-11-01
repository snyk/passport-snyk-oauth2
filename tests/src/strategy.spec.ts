/**
 * Since we are inheriting the passport OAuth2 strategy
 * with very little code change. Most of the test cases
 * are already covered.
 */
import { testData, setupExpressApp } from '../helpers/setupApp';
import supertest from 'supertest';
import passport from 'passport';

describe('Strategy with passport', () => {
  const app = setupExpressApp();
  const request = supertest(app);

  // This will trigger the auth flow
  app.get('/auth', passport.authenticate('snyk-oauth2', { state: 'test' }));
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

  it('should redirect for authorization', async () => {
    // Call the endpoint to trigger auth flow
    const response = await request.get('/auth');
    // From MDN: The location The Location response header indicates the URL to redirect a page to.
    // It only provides a meaning when served with a 3xx (redirection) or 201 (created) status response.
    expect(response.statusCode).toBe(302);
    const redirectURL = new URL(response.header.location);
    // Assert
    // The authorization URL
    expect(`${redirectURL.origin}${redirectURL.pathname}`).toBe(testData.authorizationURL);
    // All the query parameters
    expect(redirectURL.searchParams.get('nonce')).toBe(testData.nonce);
    expect(redirectURL.searchParams.get('response_type')).toBe('code');
    // eslint-disable-next-line spellcheck/spell-checker
    expect(redirectURL.searchParams.get('redirect_uri')).toBe(testData.callbackURL);
    expect(redirectURL.searchParams.get('scope')).toBe(testData.scope);
    expect(redirectURL.searchParams.get('client_id')).toBe(testData.clientID);
  });

  it('should call the failure mock when not authenticated', async () => {
    await request.get('/auth');
    const responseTwo = await request.get(`/callback?code=${1234}&scope=apps%3Abeta&state=test`);
    expect(responseTwo.statusCode).toBe(302);
    expect(responseTwo.header.location).toBe('/callback/failure');
  });
});
