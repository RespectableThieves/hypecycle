import 'react-native-gesture-handler/jestSetup';

// Note: test renderer must be required after react-native.
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

// Need a custom mock here.
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(),
  useAuthRequest: jest
    .fn()
    .mockReturnValue([
      null,
      {type: 'success', params: {code: '123'}},
      jest.fn(),
    ]),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// As of react-native@0.64.X file has moved
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
