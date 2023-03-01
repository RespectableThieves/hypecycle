import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerNav } from './src/components/DrawerNav';
import { BleSensors } from 'react-native-cycling-sensors';
import { useEffect } from 'react';
import globalData from './src/lib/GlobalContext'

const bleSensor = new BleSensors();
console.log('bleSensor',bleSensor.checkState())
const UPDATE_INTERVAL = 3;

const handleError = (error: Error) => {
  console.log('Got error: ', error);
};

function App() {
  useEffect(() => {
    const startServicesAndTasks = async () => {
      console.log('Starting Services and Tasks to pull sensor data')
      
      async function periodicTasks() {
        console.log("Update every 3 seconds")
        // TODO: Get accelerometer, light, temp, battery data here
        setTimeout(periodicTasks, 1000*UPDATE_INTERVAL);
      }
      periodicTasks(); // Start periodic tasks
      // await launchLocationTracking() //Start the background GPS location service

      // Create our global ble object
      bleSensor.requestPermissions()
      .then(() =>{console.log("Ble permissions requested")})
      .then(() =>{
        bleSensor.start().catch((err) => handleError(err));
      })
      .catch((err) => handleError(err));
    };
  
    startServicesAndTasks(); // run it, run it
  
    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return (
    <globalData.Provider value={{ble: bleSensor}}>
      <PaperProvider theme={DefaultTheme}>
          <StatusBar hidden/>
          <NavigationContainer>
            <DrawerNav />
          </NavigationContainer>
      </PaperProvider>
    </globalData.Provider>
  );
}

export default gestureHandlerRootHOC(App);