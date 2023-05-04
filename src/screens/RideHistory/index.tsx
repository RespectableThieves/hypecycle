import * as React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function RideHistory() {
  // list view
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>History</Text>
    </View>
  );
}

function RideSummary() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>History</Text>
    </View>
  )
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={RideHistory} />
      <Stack.Screen name="Summary" component={RideSummary} />
    </Stack.Navigator>
  );
}

export default RideHistory;
