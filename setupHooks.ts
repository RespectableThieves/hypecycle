import * as SecureStore from 'expo-secure-store';
import * as strava from './src/lib/strava';
import * as Location from 'expo-location';
import {db} from './src/database';
// import adapter from './src/database/adapter'

export async function writeStravaToken() {
  const dummyStravaToken = await strava.authorize({code: '123'});
  await strava.saveToken(dummyStravaToken);
}

beforeEach(async () => {
  await writeStravaToken();
});

afterEach(async () => {
  // @ts-ignore: TODO fix mock type.
  await Location.clearAll();
  // @ts-ignore: TODO fix mock type.
  await SecureStore.clearAll();
  jest.clearAllMocks();
  // reset the db between runs
  await db.write(async () => {
    await db.unsafeResetDatabase();
  });
});
