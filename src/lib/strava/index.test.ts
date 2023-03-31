import * as strava from './';
import {SECURE_STORE_CURRENT_USER_KEY} from '../../constants';
import * as SecureStore from 'expo-secure-store';

describe('loadToken', () => {
  it('should NOT refresh if > 5mins of expiry', async () => {
    await strava.loadToken();
    expect(strava.refresh).not.toHaveBeenCalled();
  });

  it('should refresh if < 5mins of expiry', async () => {
    // I *think because
    jest.isMockFunction(strava.refresh);
    const token = await strava.loadToken();

    // make it expire now.
    // then resave it to the store
    token!.expires_at = new Date().getUTCSeconds();

    await SecureStore.setItemAsync(
      SECURE_STORE_CURRENT_USER_KEY,
      JSON.stringify(token),
    );

    await strava.loadToken();
    expect(strava.refresh).toHaveBeenCalledTimes(1);
  });
});
