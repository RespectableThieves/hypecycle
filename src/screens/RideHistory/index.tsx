import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RideList from '../../components/RideHistory'
import RideSummary from '../../components/RideSummary'
import { View, Text } from 'react-native'


const Stack = createStackNavigator();

function RideHistory() {
  return (
    <Stack.Navigator
      initialRouteName="History"
    >
      <Stack.Screen name="History" component={RideList} />
      <Stack.Screen name="Summary" component={RideSummary} />
    </Stack.Navigator>
  );
}

export default RideHistory;
