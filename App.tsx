import 'react-native-gesture-handler';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {StatusBar} from 'expo-status-bar';
import {DrawerNav} from './src/components/DrawerNav';
import {useEffect, useState} from 'react';
import globalData from './src/lib/GlobalContext';
import {
  getOrCreateRealtimeRecord,
  updateRealTimeRecord,
  onLocation,
} from './src/lib/realtimeData';
import Loading from './src/components/Loading';
import {
  ble,
  powerMeter,
  heartRateMonitor,
  cadenceMeter,
} from './src/lib/sensor';
import useLocation from './src/hooks/useLocation';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/lib/navigation';
import {StravaProvider} from './src/lib/StravaContext';
import * as strava from './src/lib/strava';

const UPDATE_INTERVAL = 3;

const handleError = (error: Error) => {
  console.log('Got error: ', error);
};

function App() {
  // hasBooted is a flag for all required vars
  // needed before mounting app.
  const [hasBooted, setHasBooted] = useState(false);
  // Set shouldTrack based on if we want GPS location trackin on or not
  const shouldTrack = true;

  const [locationError] = useLocation(shouldTrack, onLocation);
  const [stravaToken, setStravaToken] = useState<strava.Token | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (locationError) {
      Alert.alert('Error getting location');
    }
    const startServicesAndTasks = async () => {
      console.log('ble', ble.checkState());
      const realtimeRecord = await getOrCreateRealtimeRecord();

      timer = setInterval(async () => {
        await updateRealTimeRecord(realtimeRecord);
        console.log('updated realtime data');
      }, 1000 * UPDATE_INTERVAL);
      // await launchLocationTracking() //Start the background GPS location service

      // Create our global ble object
      ble
        .requestPermissions()
        .then(() => {
          console.log('Ble permissions requested');
        })
        .then(() => {
          ble.start().catch((err: Error) => handleError(err));
        })
        .catch((err: Error) => handleError(err));

      const token = await strava.loadToken();
      setStravaToken(token);

      setHasBooted(true);
    };

    startServicesAndTasks(); // run it

    return () => {
      clearInterval(timer);
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
          <NavigationContainer ref={navigationRef}>
            <DrawerNav />
          </NavigationContainer>
        </StravaProvider>
      </PaperProvider>
    </globalData.Provider>
  );
}

export default gestureHandlerRootHOC(App);
