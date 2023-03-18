import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import ActiveRideView from '../../screens/Home';
import {Sensors} from '../../screens/Sensors';
import {useEffect} from 'react';
import {Button} from 'react-native-paper';
import NavigationView from '../../screens/Navigation';

const Drawer = createDrawerNavigator();
export type DrawerNavProps = DrawerScreenProps<any>;

const HeaderRight = () => (
  // Add a placeholder button without the `onPress` to avoid flicker
  <Button
    icon="plus-thick"
    mode="contained"
    buttonColor={'#93B7BE'}
    textColor={'#454545'}>
    Add
  </Button>
);

function DrawerNav() {
  useEffect(() => {}, []);

  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Active Ride">
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
    </Drawer.Navigator>
  );
}

export {DrawerNav};
