import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RideList from '../../components/RideHistory'
import { View, Text } from 'react-native'

// function RideSummary() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>History</Text>
//     </View>
//   )
// }
//
function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function RideHistory() {
  return (
    <Stack.Navigator
      initialRouteName="History"
    >
      <Stack.Screen options={{ title: 'Overview' }} name="History" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default RideHistory;
