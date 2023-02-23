import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Sensors } from './src/screens/Sensors';

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    mintCream: '#F1FFFA',
    timberWolf: '#D5C7BC',
    lightBlue: '#93B7BE',
    roseTaupe: '#785964',
    onyx: '#454545'
  },
};

function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar
        style="light"
        hidden
        backgroundColor="transparent"
      />
      <Sensors />
    </PaperProvider>
  );
}

export default gestureHandlerRootHOC(App);