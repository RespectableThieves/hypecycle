import Constants from '../../constants';
import * as SecureStore from 'expo-secure-store';
import {authorize, refreshToken, Athlete, Token, upload} from './api';

// Note loadToken can't be in the same
// module as .refresh because then mocking doesn't
// work so we've split it into ./api + index
async function loadToken(): Promise<Token | null> {
  const tokenData = await SecureStore.getItemAsync(
    Constants.secureStoreCurrentUserId,
  );

  if (tokenData) {
    // ensure its fresh.
    const token = JSON.parse(tokenData);

    // strava access tokens has a 6hr ttl so we check if they
    // are within 5 mins of expiry before refreshing.
    const now = Math.round(Date.now() / 1000);

    const fiveMinutes = 60 * 5;

    if (now > token.expires_at + fiveMinutes) {
      console.log(
        'strava token is expired by ',
        now - token.expires_at + fiveMinutes,
      );
      const newToken = await refreshToken(token.refresh_token);

      const t = {
        ...newToken,
        athlete: token.athlete,
      };
      await saveToken(t);

      return t;
    }

    console.log(
      `strava token is still valid for ${
        token.expires_at + fiveMinutes - now
      } seconds`,
    );

    return token;
  }

  return null;
}

async function saveToken(token: Token) {
  await SecureStore.setItemAsync(
    Constants.secureStoreCurrentUserId,
    JSON.stringify(token),
  );
}

async function deleteToken() {
  await SecureStore.deleteItemAsync(Constants.secureStoreCurrentUserId);
}

export {authorize, refreshToken, loadToken, saveToken, deleteToken, upload};

export type {Athlete, Token};
