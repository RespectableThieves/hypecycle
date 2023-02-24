import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MD3DarkTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Sensors } from './src/screens/Sensors';

function App() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <StatusBar
        hidden
      />
      <Sensors />
    </PaperProvider>
  );
}

export default gestureHandlerRootHOC(App);