import {RideSummaryModel, db, Q} from '../../database';
import withObservables from '@nozbe/with-observables';
import {FlatList} from 'react-native';
import {List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RideHistoryStack} from '../../navigators/RideHistory';

type Summary = StackNavigationProp<RideHistoryStack, 'Summary'>;

export function RideOverview({summary}: {summary: RideSummaryModel}) {
  const navigation = useNavigation<Summary>();

  return (
    <List.Item
      title={summary.ride.id}
      description={summary.createdAt.toString()}
      onPress={() => {
        navigation.navigate('Summary', {summaryId: summary.id});
      }}
    />
  );
}

function RideList({summaries}: {summaries: RideSummaryModel[]}) {
  return (
    <>
      <FlatList<RideSummaryModel>
        data={summaries}
        keyExtractor={item => item?.id}
        renderItem={({item}) => <RideOverview summary={item} />}
      />
    </>
  );
}

const enhance = withObservables([], () => {
  return {
    summaries: db
      .get<RideSummaryModel>('ride_summary')
      .query(Q.sortBy('created_at', Q.desc))
      .observe(),
  };
});

export default enhance(RideList);
