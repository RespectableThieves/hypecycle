import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import ActiveRideView from '../../screens/Home';
import Sensors from '../../screens/Sensors';
import {Button} from 'react-native-paper';
import NavigationView from '../../screens/Navigation';
import SettingsView from '../../screens/Settings';
import RideHistory from '../../screens/RideHistory';
import {Drawer as PaperDrawer} from 'react-native-paper';

const Drawer = createDrawerNavigator();
export type DrawerNavProps = DrawerScreenProps<any>;

const DrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <PaperDrawer.Item
        icon="bike"
        label="Active Ride"
        onPress={() => {
          props.navigation.navigate('Active Ride');
        }}
      />
      <PaperDrawer.Item
        icon="map"
        label="Navigation"
        onPress={() => {
          props.navigation.navigate('Navigation');
        }}
      />
      <PaperDrawer.Item
        icon="bluetooth"
        label="Sensors"
        onPress={() => {
          props.navigation.navigate('Sensors');
        }}
      />
      <PaperDrawer.Item
        label="Rides"
        icon="bike"
        onPress={() => {
          props.navigation.navigate('RideHistory');
        }}
      />
      <PaperDrawer.Item
        label="Settings"
        icon="tune"
        onPress={() => {
          props.navigation.navigate('Settings');
        }}
      />
    </DrawerContentScrollView>
  );
};

const HeaderRight = () => (
  // Add a placeholder button without the `onPress` to avoid flicker
  <Button icon="plus-thick" mode="contained">
    Add
  </Button>
);

function DrawerNav() {
  return (
    <Drawer.Navigator
      screenOptions={{headerTintColor: '#FFFFFF'}}
      useLegacyImplementation
      initialRouteName="Home"
      drawerContent={DrawerContent}>
      <Drawer.Screen
        name="Active Ride"
        component={ActiveRideView}
        options={{drawerLabel: 'Active Ride'}}
      />
      <Drawer.Screen
        name="Navigation"
        component={NavigationView}
        options={{drawerLabel: 'Navigation'}}
      />
      <Drawer.Screen
        name="Sensors"
        component={Sensors}
        options={{
          drawerLabel: 'Sensors',
          headerRight: HeaderRight,
        }}
      />
      <Drawer.Screen
        name="RideHistory"
        component={RideHistory}
        options={{drawerLabel: 'Active Ride'}}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsView}
        options={{drawerLabel: 'Settings'}}
      />
    </Drawer.Navigator>
  );
}

export {DrawerNav};
