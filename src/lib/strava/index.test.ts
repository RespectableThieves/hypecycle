import * as strava from './';

describe('loadToken', () => {
  it('should NOT refresh if token is valid for > 5 mins', async () => {
    await strava.loadToken();
    expect(strava.refreshToken).not.toHaveBeenCalled();
  });

  it('should refresh if < 5mins of expiry', async () => {
    const token = await strava.loadToken();
    // make it expire now.
    // then resave it to the store
    token!.expires_at = new Date().getUTCSeconds();

    await strava.saveToken(token as strava.Token);

    await strava.loadToken();
    expect(strava.refreshToken).toHaveBeenCalledTimes(1);
  });
});
