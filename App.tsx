import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerNav } from './src/components/DrawerNav';
import {
  BleSensors,
  PowerMeter,
  HeartRateMonitor,
  CadenceMeter,
  // @ts-ignore
} from 'react-native-cycling-sensors';
import { useEffect } from 'react';
import globalData from './src/lib/GlobalContext';

const bleSensor = new BleSensors();
const pMeter = new PowerMeter();
const hrMeter = new HeartRateMonitor();
const cMeter = new CadenceMeter();

console.log('bleSensor', bleSensor.checkState());
const UPDATE_INTERVAL = 3;

const handleError = (error: Error) => {
  console.log('Got error: ', error);
};

function App() {
  // todo type
  let timer: any
  useEffect(() => {
    const startServicesAndTasks = async () => {
      console.log('Starting Services and Tasks to pull sensor data');

      timer = setInterval(() => {
        console.log('Update every 3 seconds');
        // TODO: Get accelerometer, light, temp, battery data here
      }, 1000 * UPDATE_INTERVAL)

      // await launchLocationTracking() //Start the background GPS location service

      // Create our global ble object
      bleSensor
        .requestPermissions()
        .then(() => {
          console.log('Ble permissions requested');
        })
        .then(() => {
          bleSensor.start().catch((err: Error) => handleError(err));
        })
        .catch((err: Error) => handleError(err));
    };

    startServicesAndTasks(); // run it, run it

    return () => {
      clearInterval(timer)
      // this now gets called when the component unmounts

    };
  }, []);

  return (
    <globalData.Provider
      value={{
        ble: bleSensor,
        powerMeter: pMeter,
        heartRateMonitor: hrMeter,
        cadenceMeter: cMeter,
      }}>
      <PaperProvider theme={DefaultTheme}>
        <StatusBar hidden />
        <NavigationContainer>
          <DrawerNav />
        </NavigationContainer>
      </PaperProvider>
    </globalData.Provider>
  );
}

export default gestureHandlerRootHOC(App);
