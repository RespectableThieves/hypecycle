import { createStackNavigator } from '@react-navigation/stack';

export type ActiveRideStack = {
  Stats: undefined;
  Summary: {
    summaryId: string;
  };
};
export default createStackNavigator<ActiveRideStack>();
