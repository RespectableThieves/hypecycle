import * as React from 'react';
import RideList from '../../components/RideList';
import RideSummary from '../../components/RideSummary';
import Stack from '../../navigators/RideHistory';

function RideHistory() {
  return (
    <Stack.Navigator initialRouteName="History">
      <Stack.Screen options={{ headerStyle: { height: 0 } }} name="History" component={RideList} />
      <Stack.Screen options={{ title: "" }} name="Summary" component={RideSummary} />
    </Stack.Navigator>
  );
}

export default RideHistory;
