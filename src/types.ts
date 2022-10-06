import { StrategyOptionsWithRequest } from 'passport-oauth2';

export interface SnykStrategyOptions extends StrategyOptionsWithRequest {
  authorizationURL: string;
  tokenURL: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;

  /**
   * The nonce is required for Snyk Authentication process.
   *
   * @deprecated Pass it in options for passport.authenticate.
   */
  nonce?: string;
  scope: string | string[];
  state: any;

  /**
   * This is called is user wants to call any Snyk API
   * to get profile for their records.
   */
  profileFunc?: ProfileFunc;
}

export interface ProfileCallback {
  (error: Error | null): void;
}

export interface ProfileCallback {
  (error: Error | null, data: any): void;
}

export interface ProfileFunc {
  (accessToken: string): Promise<any>;
}
