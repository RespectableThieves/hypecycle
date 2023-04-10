import 'react-native-gesture-handler';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {StatusBar} from 'expo-status-bar';
import {DrawerNav} from './src/components/DrawerNav';
import {useEffect, useState} from 'react';
import globalData from './src/lib/GlobalContext';
import {
  onLocation,
  snapshotWorker,
  simulateRealtimeDataWorker,
  getOrCreateRealtimeRecord,
} from './src/lib/data';
import Loading from './src/components/Loading';
import {
  ble,
  powerMeter,
  heartRateMonitor,
  cadenceMeter,
} from './src/lib/sensor';
import useLocation from './src/hooks/useLocation';
import {Alert} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {navigationRef} from './src/lib/navigation';
import {StravaProvider} from './src/lib/StravaContext';
import * as strava from './src/lib/strava';
import {isDevice} from 'expo-device';
import {useKeepAwake} from 'expo-keep-awake';
import {hrService, powerService} from './src/lib/data/bluetooth';

function App() {
  // hasBooted is a flag for all required vars
  // needed before mounting app.
  const [hasBooted, setHasBooted] = useState(false);
  // Set shouldTrack based on if we want GPS location trackin on or not
  const shouldTrack = true;
  // keep the screen awake so our services can run.
  useKeepAwake();

  const [locationError] = useLocation(shouldTrack, onLocation);
  const [stravaToken, setStravaToken] = useState<strava.Token | null>(null);

  useEffect(() => {
    if (locationError) {
      Alert.alert('Error getting location');
    }
    const startServicesAndTasks = async () => {
      console.log('ble', await ble.checkState());
      // Ensure that the realtime row is setup
      // before we run any async services.
      await getOrCreateRealtimeRecord();

      if (!isDevice) {
        // this only runs in the emulator
        await simulateRealtimeDataWorker.start(3000);
      }

      await snapshotWorker.start(1000);

      // Create our global ble object
      try {
        await ble.requestPermissions();
        await ble.start();
      } catch (err) {
        console.log(err);
      }

      try {
        await hrService.start();
      } catch (err) {
        console.log(err)
      }

      try {
        await powerService.start();
      } catch (err) {
        console.log(err)
      }

      const token = await strava.loadToken();
      setStravaToken(token);

      setHasBooted(true);
    };

    startServicesAndTasks(); // run it

    return () => {
      simulateRealtimeDataWorker.stop();
      snapshotWorker.stop();
      hrService.stop();
      powerService.stop();
      // this now gets called when the component unmounts
    };
  }, [locationError]);

  if (!hasBooted) {
    // TODO style splash screen
    return <Loading />;
  }

  return (
    <globalData.Provider
      value={{
        ble,
        powerMeter,
        heartRateMonitor,
        cadenceMeter,
      }}>
      <PaperProvider theme={DefaultTheme}>
        <StatusBar hidden />
        <StravaProvider stravaToken={stravaToken}>
          <NavigationContainer theme={DarkTheme} ref={navigationRef}>
            <DrawerNav />
          </NavigationContainer>
        </StravaProvider>
      </PaperProvider>
    </globalData.Provider>
  );
}

export default gestureHandlerRootHOC(App);
