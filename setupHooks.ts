import {SECURE_STORE_CURRENT_USER_KEY} from './src/constants';
import * as SecureStore from 'expo-secure-store';

export const dummyStravaToken = {
  token_type: 'Bearer',
  expires_at: 1680054476,
  expires_in: 21600,
  refresh_token: 'xyz',
  access_token: 'abc',
  athlete: {
    id: 101,
    username: null,
    resource_state: 2,
    firstname: 'Craig',
    lastname: 'Mulligan',
    bio: null,
    city: '',
    state: '',
    country: null,
    sex: null,
    premium: false,
    summit: false,
    created_at: '2022-03-30T16:36:16Z',
    updated_at: '2023-03-28T17:43:08Z',
    badge_type_id: 0,
    weight: 84.0008,
    profile_medium:
      'https://lh3.googleusercontent.com/a/AGNmyxafxyza4C7yewDLpgLWrmXW-Rmrds543HpKSrA_=s96-c',
    profile:
      'https://lh3.googleusercontent.com/a/AGNmyxafxyza4C7yewDLpgLWrmXW-Rmrds543HpKSrA_=s96-c',
    friend: null,
    follower: null,
  },
};

export async function writeStravaToken() {
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
  jest.clearAllMocks();
});
