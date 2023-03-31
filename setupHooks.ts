import {SECURE_STORE_CURRENT_USER_KEY} from './src/constants';
import * as SecureStore from 'expo-secure-store';
import {authorize} from './src/lib/strava';

export async function writeStravaToken() {
  const dummyStravaToken = await authorize({code: '123'});
  await SecureStore.setItemAsync(
    SECURE_STORE_CURRENT_USER_KEY,
    JSON.stringify(dummyStravaToken),
  );
}

beforeEach(async () => {
  await writeStravaToken();
});

afterEach(async () => {
  // @ts-ignore: TODO fix mock type.
  await SecureStore.clearAll();
  jest.resetAllMocks();
});
