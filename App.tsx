import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { Sensors } from './src/screens/Sensors';

function App() {
  return (
    <>
      <StatusBar
        style="light"
        translucent
        backgroundColor="transparent"
      />
      <Sensors />
    </>
  );
}

export default gestureHandlerRootHOC(App);