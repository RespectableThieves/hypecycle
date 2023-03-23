import 'react-native-gesture-handler';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {DrawerNav} from './src/components/DrawerNav';
import {useEffect, useState} from 'react';
import globalData from './src/lib/GlobalContext';
import {getOrCreateRealtimeRecord, updateRealTimeRecord} from './src/utils';
import Loading from './src/components/Loading';
import {
  ble,
  powerMeter,
  heartRateMonitor,
  cadenceMeter,
} from './src/lib/sensors';
import {navigationRef} from './src/lib/navigation';
import {LocationCallback} from 'expo-location';
import useLocation from './src/hooks/useLocation';
import {Alert} from 'react-native';

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

  // Define the callback to handle location updates
  const handleLocationUpdate: LocationCallback = location => {
    console.log('New location:', location);
    // TODO: update realtimeData table here
  };
  // Use the useLocation hook
  const [locationError] = useLocation(shouldTrack, handleLocationUpdate);

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
        <NavigationContainer ref={navigationRef}>
          <DrawerNav />
        </NavigationContainer>
      </PaperProvider>
    </globalData.Provider>
  );
}

export default gestureHandlerRootHOC(App);
