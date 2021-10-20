import { _StrategyOptionsBase } from 'passport-oauth2';
import { OutgoingHttpHeaders } from 'http';

export interface StrategyOptions extends _StrategyOptionsBase {
  authorizationURL: string;
  tokenURL: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  nonce: string;
  scope: string | string[];
  state: any;
  passReqToCallback?: any;
  customHeaders?: OutgoingHttpHeaders | undefined;
  scopeSeparator?: string;
  pkce?: any;
  sessionKey?: string;
  store?: any;
  proxy?: boolean;
  skipUserProfile?: boolean;
  userProfileURL?: string;
}

export interface UserProfileCallback {
  (error: Error | null): void;
}

export interface UserProfileCallback {
  (error: Error | null, data: any): void;
}

export interface UserDetails {
  id: string;
  username: string;
  email: string;
  orgs: string[];
}
