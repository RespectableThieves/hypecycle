import { createStackNavigator } from '@react-navigation/stack';

export type RideHistoryStack = {
  History: undefined;
  Summary: {
    summaryId: string;
  };
};
export default createStackNavigator<RideHistoryStack>();
