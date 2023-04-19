// NOTE: This file is loaded in both node.js envs
// and react-native. It must therefore be agnostic to both.
// process.env is handled by transform-inline-environment-variables
type AppVariant = 'test' | 'development' | 'preview' | 'production';
const appVariant = (process.env.APP_VARIANT as AppVariant) || 'development';

export type Config = {
  projectName: string;
  appName: string;
  iconColor: string;
  commitSHA: string;
  appVariant: AppVariant;
  realtimeDataId: string;
  backend: string;
  stravaBackend: string;
  stravaClientId: string;
  secureStoreCurrentUserId: string;
  mapboxPublicToken: string;
};

const common = {
  appVariant,
  projectName: 'hypecycle',
  appName: `hypecycle.${appVariant}`,
  commitSHA:
    process.env.GITHUB_SHA ||
    process.env.EAS_BUILD_GIT_COMMIT_HASH ||
    'unknown',
  realtimeDataId: 'realtimedataid',
  backend: 'https://hypecycle.hey5806.workers.dev',
  stravaBackend: 'https://www.strava.com/api/v3',
  stravaClientId: '104727',
  secureStoreCurrentUserId: 'current-user',
  mapboxPublicToken:
    'pk.eyJ1IjoiaG9ib2NoaWxkIiwiYSI6ImNqZTA1aDBleDFtaHYyeG82dnJuZGNzbHIifQ.YhtobTRfkogqAzzWa84wcg',
};

const configs = {
  test: {
    ...common,
    iconColor: '#FF5722',
  },
  development: {
    ...common,
    iconColor: '#FF5722',
  },
  preview: {
    ...common,
    iconColor: '#00D084',
  },
  production: {
    ...common,
    iconColor: '#000000',
  },
};

export const Constants: Config = configs[appVariant];

export default {
  name: Constants.appName,
  slug: Constants.projectName,
  scheme: Constants.appName,
  version: Constants.commitSHA,
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
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-location',
    'sentry-expo',
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsImpl: 'mapbox',
        RNMapboxMapsDownloadToken: process.env.MAPBOX_TOKEN,
        locationWhenInUsePermission: 'Show current location on map.',
      },
    ],
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
