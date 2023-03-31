import * as SecureStore from 'expo-secure-store';
import * as strava from './src/lib/strava';

export async function writeStravaToken() {
  const dummyStravaToken = await strava.authorize({code: '123'});
  await strava.saveToken(dummyStravaToken);
}

beforeEach(async () => {
  await writeStravaToken();
});

afterEach(async () => {
  // @ts-ignore: TODO fix mock type.
  await SecureStore.clearAll();
  jest.clearAllMocks();
});
