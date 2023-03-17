import {createDrawerNavigator} from '@react-navigation/drawer';
import ActiveRideView from '../../screens/Home';
import {Sensors} from '../../screens/Sensors';
import {useEffect} from 'react';
import {Button} from 'react-native-paper';
import NavigationView from '../../screens/Navigation';

const Drawer = createDrawerNavigator();
const handleError = (error: Error) => {
  console.log('Got error: ', error);
};

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
          headerRight: () => (
            // Add a placeholder button without the `onPress` to avoid flicker
            <Button
              icon="plus-thick"
              mode="contained"
              buttonColor={'#93B7BE'}
              textColor={'#454545'}>
              Add
            </Button>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export {DrawerNav};
