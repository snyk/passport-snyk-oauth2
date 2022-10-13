import { Strategy, VerifyFunctionWithRequest } from 'passport-oauth2';
import { SnykStrategyOptions, ProfileFunc, ProfileCallback } from './types';

/**
 * SnykOAuth2Strategy for Passport.js to make users
 * experience with Snyk Apps authentication seamless.
 * It extends the OAuth2 strategy provided by Passport.js
 */
export default class SnykOAuth2Strategy extends Strategy {
  private _profileFunc?: ProfileFunc;

  constructor(options: SnykStrategyOptions, verify: VerifyFunctionWithRequest) {
    super(options, verify);
    this.name = 'snyk-oauth2';
    if (options.profileFunc) this._profileFunc = options.profileFunc;
  }

  authorizationParams(options: any): any {
    if (!options || !options.nonce) {
      throw new Error('Nonce value required, pass it in options for passport.authenticate function call.');
    }
    return options;
  }

  tokenParams(options: any): any {
    if (!options || !options.nonce) {
      throw new Error('Nonce value required, pass it in options for passport.authenticate function call.');
    }
    return options;
  }

  /**
   * Overrides the userProfile function provided by passport
   * If you notice we only call is profile because Snyk Apps authentication
   * may not be limited to a single user, it could be attached to Snyk Orgs, etc
   * @param {String} accessToken: Fetched from the apps authorization process
   * @param {ProfileCallback} done: Callback function, called when function execution completes
   * @returns a Promise with whatever comes back from calling the providing function
   * or Error in case the provided function throws an error
   */
  async userProfile(accessToken: string, done: ProfileCallback): Promise<any> {
    if (this._profileFunc) {
      try {
        const result = await this._profileFunc(accessToken);
        return done(null, result);
      } catch (error: any) {
        return done(error);
      }
    }
    done(null, 'No profile function provided');
  }
}
