import * as React from 'react';
import RideList from '../../components/RideList';
import RideSummary from '../../components/RideSummary';
import Stack from '../../navigators/RideHistoryStack';

function RideHistory() {
  return (
    <Stack.Navigator initialRouteName="History">
      <Stack.Screen
        options={{headerShown: false}}
        name="History"
        component={RideList}
      />
      <Stack.Screen
        options={{title: ''}}
        name="Summary"
        component={RideSummary}
      />
    </Stack.Navigator>
  );
}

export default RideHistory;
