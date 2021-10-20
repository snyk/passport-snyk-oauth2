import { Strategy } from 'passport-oauth2';
import { StrategyOptions, UserProfileCallback, UserDetails } from './types';
import axios from 'axios';

export default class SnykOAuth2Strategy extends Strategy {
  private _nonce: string;
  private _userProfileURL: string;
  constructor(options: StrategyOptions, verify: any) {
    super(options, verify);
    this._nonce = options.nonce;
    this.name = 'snyk-oauth2';
    this._userProfileURL = options.userProfileURL || 'https://api.snyk.io/v1/user/me';
  }

  authorizationParams(): any {
    return {
      nonce: this._nonce,
    };
  }

  async userProfile(accessToken: string, done: UserProfileCallback) {
    try {
      const result = await axios.get(this._userProfileURL, {
        headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `bearer ${accessToken}` },
      });
      const { id } = result.data as UserDetails;
      return done(null, { id });
    } catch (error: any) {
      return done(error);
    }
  }
}
