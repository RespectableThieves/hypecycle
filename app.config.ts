type AppVariant = 'test' | 'development' | 'preview' | 'production';

export type Settings = {
  appName: string;
  projectName: string;
  appVariant: AppVariant;
  realtimeDataId: string;
  backend: string;
  stravaBackend: string;
  stravaClientId: string;
  secureStoreCurrentUserId: string;
  iconColor: string;
};

function ensure(val: string | undefined, key: string) {
  if (val === undefined) {
    throw Error(`envar ${key} is not set`);
  }

  return val;
}

// NB: because we are using babel transform-inline-environment-variables
// we need to explicitly call each envar key.
export const Constants: Settings = {
  appName: ensure(process.env.APP_NAME, 'APP_NAME'),
  projectName: ensure(process.env.PROJECT_NAME, 'PROJECT_NAME'),
  appVariant: ensure(process.env.APP_VARIANT, 'APP_VARIANT') as AppVariant,
  realtimeDataId: ensure(process.env.REALTIME_DATA_ID, 'REALTIME_DATA_ID'),
  backend: ensure(process.env.BACKEND, 'BACKEND'),
  stravaBackend: ensure(process.env.STRAVA_BACKEND, 'STRAVA_BACKEND'),
  stravaClientId: ensure(process.env.STRAVA_CLIENT_ID, 'STRAVA_CLIENT_ID'),
  secureStoreCurrentUserId: ensure(
    process.env.SECURE_STORE_CURRENT_USER_KEY,
    'SECURE_STORE_CURRENT_USER_KEY',
  ),
  iconColor: ensure(process.env.ICON_COLOR, 'ICON_COLOR'),
};

export default {
  name: Constants.appName,
  slug: Constants.projectName,
  scheme: Constants.appName,
  version: '1.0.0',
  orientation: 'landscape',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    requireFullScreen: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: Constants.iconColor || '#ffffff',
    },
    package: `com.craigmulligan.${Constants.appName}`,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAP_API_KEY,
      },
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-location',
    'sentry-expo',
    [
      '@config-plugins/react-native-ble-plx',
      {
        isBackgroundEnabled: true,
        modes: ['peripheral', 'central'],
        bluetoothAlwaysPermission: `Allow $(${Constants.projectName}) to connect to bluetooth devices`,
      },
    ],
    '@morrowdigital/watermelondb-expo-plugin',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '1.6.10',
        },
      },
    ],
  ],
  extra: {
    ...Constants,
    eas: {
      projectId: 'fd6a3f46-9558-42c7-a0d2-b0b600637c7b',
    },
  },
  hooks: {
    // NOTE: process.env.SENTRY_AUTH_TOKEN needs to be in env
    // when running expo publish
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'craigmulligan',
          project: Constants.projectName,
        },
      },
    ],
  },
  updates: {
    url: 'https://u.expo.dev/fd6a3f46-9558-42c7-a0d2-b0b600637c7b',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
};
