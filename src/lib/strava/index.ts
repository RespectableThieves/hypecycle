import {SECURE_STORE_CURRENT_USER_KEY} from '../../constants';
import * as SecureStore from 'expo-secure-store';
import {authorize, refresh, Athlete, Token} from './api';

// Note loadToken can't be in the same
// module as .refresh because then mocking doesn't
// work so we've split it into ./api + index
async function loadToken(): Promise<Token | null> {
  const tokenData = await SecureStore.getItemAsync(
    SECURE_STORE_CURRENT_USER_KEY,
  );

  if (tokenData) {
    // ensure its fresh.
    const token = JSON.parse(tokenData);

    // strava access tokens has a 6hr ttl so we check if they
    // are within 5 mins of expiry before refreshing.
    if (token.expires_at + 60 * 5 > new Date().getUTCSeconds()) {
      console.log('token is expired');
      return exports.refresh(token.refresh_token);
    }

    return token;
  }

  return null;
}

export {authorize, refresh, loadToken};

export type {Athlete, Token};
