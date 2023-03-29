import 'react-native-gesture-handler/jestSetup';
// Note: test renderer must be required after react-native.
jest.useFakeTimers();
jest.mock('./src/database/adapter');
jest.mock('react-native-cycling-sensors');
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-location');
jest.mock('expo-secure-store');
jest.mock('expo-linking');

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock('expo-auth-session', () => {
  let req: any = null;
  let res: any = null;

  const promptAsync = () => {
    res = {type: 'success', params: {code: '123'}};
    return Promise.resolve();
  };

  const useAuthRequest = () => {
    return [req, res, promptAsync];
  };

  return {
    makeRedirectUri: jest.fn(),
    useAuthRequest,
  };
});

jest.mock('./src/lib/strava', () => {
  const mod = jest.requireActual('./src/lib/strava');

  return {
    ...mod,
    // ensure we don't call the API in
    // tests accidentally
    authorize: jest.fn().mockResolvedValue({
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
    }),
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
// As of react-native@0.64.X file has moved
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
// jest.mock('react-native/Libraries/Animated/Easing');
