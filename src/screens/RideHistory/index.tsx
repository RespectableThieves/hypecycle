import * as React from 'react';
import RideList from '../../components/RideHistory';
import RideSummary from '../../components/RideSummary';
import Stack from '../../navigators/RideHistory';

function RideHistory() {
  return (
    <Stack.Navigator initialRouteName="History">
      <Stack.Screen name="History" component={RideList} />
      <Stack.Screen name="Summary" component={RideSummary} />
    </Stack.Navigator>
  );
}

export default RideHistory;
