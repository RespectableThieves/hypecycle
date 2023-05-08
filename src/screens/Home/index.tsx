import WidgetGrid from '../../components/WidgetGrid';
import RideFab from '../../components/RideFab';
import { View } from 'react-native';
import RideSummary from '../../components/RideSummary';
import { Portal } from 'react-native-paper';
import Stack from '../../navigators/ActiveRideStack';

const Stats = () => {
  return (
    <Portal.Host>
      <View>
        <RideFab />
        <WidgetGrid widgetArray={[]} />
      </View>
    </Portal.Host>
  );
};

function ActiveRide() {
  return (
    <Stack.Navigator initialRouteName="Stats">
      <Stack.Screen options={{ headerStyle: { height: 0 } }} name="Stats" component={Stats} />
      <Stack.Screen options={{ title: "" }} name="Summary" component={RideSummary} />
    </Stack.Navigator>
  )
}

export default ActiveRide;
