import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerNav } from './src/components/DrawerNav';

const Drawer = createDrawerNavigator();

function App() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <StatusBar hidden/>
      <NavigationContainer>
        <DrawerNav />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default gestureHandlerRootHOC(App);