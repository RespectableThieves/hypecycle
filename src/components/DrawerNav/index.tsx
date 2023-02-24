import { createDrawerNavigator } from '@react-navigation/drawer';
import ActiveRideView from '../../screens/Home'
import { Sensors } from '../../screens/Sensors';
import { useEffect } from 'react';

const Drawer = createDrawerNavigator();
const handleError = (error: Error) => {
  console.log('Got error: ', error);
};

function DrawerNav() {
    useEffect(() => {
      
    }, []);
    
    return (
      <Drawer.Navigator useLegacyImplementation initialRouteName="Feed">
        <Drawer.Screen
          name="Active Ride"
          component={ActiveRideView}
          options={{ drawerLabel: 'Active Ride' }}
        />
        <Drawer.Screen
          name="Sensors"
          component={Sensors}
          options={{ drawerLabel: 'Sensors' }}
        />
      </Drawer.Navigator>
    );
  }

  export { DrawerNav }