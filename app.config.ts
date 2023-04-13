export default {
  name: 'hypecycle',
  slug: 'hypecycle',
  scheme: 'hypecycle',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.craigmulligan.hypecycle',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAP_API_KEY,
      }
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
          'Allow $(PRODUCT_NAME) to connect to bluetooth devices',
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
    [
      'expo-screen-orientation',
      {
        initialOrientation: 'LANDSCAPE',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'fd6a3f46-9558-42c7-a0d2-b0b600637c7b',
    },
  },
};
