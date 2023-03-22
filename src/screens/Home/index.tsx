import WidgetGrid from '../../components/WidgetGrid';
import RideFab from '../../components/RideFab';
import {View} from 'react-native';

const ActiveRideView = () => {
  return (
    <View>
      <RideFab />
      <WidgetGrid widgetArray={[]} />
    </View>
  );
};

export default ActiveRideView;
