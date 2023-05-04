import WidgetGrid from '../../components/WidgetGrid';
import RideFab from '../../components/RideFab';
import { View } from 'react-native';
import { Portal } from 'react-native-paper';

const ActiveRideView = () => {
  return (
    <Portal.Host>
      <View>
        <RideFab />
        <WidgetGrid widgetArray={[]} />
      </View>
    </Portal.Host>
  );
};

export default ActiveRideView;
