import { Strategy, VerifyFunctionWithRequest } from 'passport-oauth2';
import { SnykStrategyOptions, ProfileFunc, ProfileCallback } from './types';

/**
 * SnykOAuth2Strategy for Passport.js to make users
 * experience with Snyk Apps authentication seamless
 * It extends the OAuth2 strategy provided by Passport.js
 */
export default class SnykOAuth2Strategy extends Strategy {
  /**
   * nonce: value is required for Snyk Authentication process
   * profileFunc: is called is user wants to call any Snyk API
   * to get profile for their records
   */
  private _nonce = '';
  private _tenantId = '';
  private _profileFunc?: ProfileFunc;

  constructor(options: SnykStrategyOptions, verify: VerifyFunctionWithRequest) {
    super(options, verify);
    this.name = 'snyk-oauth2';
    if (options.profileFunc) this._profileFunc = options.profileFunc;
  }

  public set nonce(value: string) {
    this._nonce = value;
  }

  public set tenantId(value: string) {
    this._tenantId = value;
  }

  /**
   * Function adds the nonce value to the URL being called for authentication
   */
  authorizationParams(): any {
    const params: any = {};
    if (this._nonce) {
      params.nonce = this._nonce;
    } else {
      throw new Error('nonce value required');
    }

    if (this._tenantId) {
      params.tenant_id = this._tenantId;
    }
    return params;
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
