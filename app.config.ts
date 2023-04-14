const projectName = 'hypecycle'
const appName = process.env.APP_VARIANT === 'production' ? projectName : `${projectName}-${process.env.APP_VARIANT}`;

export default {
  name: appName,
  slug: projectName,
  scheme: appName,
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
      backgroundColor: '#ffffff',
    },
    package: `com.craigmulligan.${appName}`,
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
        bluetoothAlwaysPermission:
          `Allow $(${projectName}) to connect to bluetooth devices`,
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
    eas: {
      projectId: 'fd6a3f46-9558-42c7-a0d2-b0b600637c7b',
    },
  },
  "hooks": {
    // NOTE: process.env.SENTRY_AUTH_TOKEN needs to be in env 
    // when running expo publish
    "postPublish": [
      {
        "file": "sentry-expo/upload-sourcemaps",
        "config": {
          "organization": "craigmulligan",
          "project": projectName
        }
      }
    ]
  }
};
