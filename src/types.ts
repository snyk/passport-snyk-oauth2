import { StrategyOptionsWithRequest } from 'passport-oauth2';

export interface SnykStrategyOptions extends StrategyOptionsWithRequest {
  authorizationURL: string;
  tokenURL: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope: string | string[];
  state: any;
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
