import {RideSummaryModel, db} from '../../database';
import withObservables from '@nozbe/with-observables';
import {Button, Text, Card} from 'react-native-paper';
import MapRoute from '../MapRoute';
import {View, StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RideHistoryStack} from '../../navigators/RideHistoryStack';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: -5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

function RideSummary({summary}: {summary: RideSummaryModel}) {
  return (
    <View style={styles.container}>
      <MapRoute rideId={summary.ride.id} />
      <Card style={styles.card}>
        <Card.Title
          title={summary.ride.id}
          subtitle={summary.createdAt.toString()}
        />
        <Card.Content>
          <Text>stats goes here.</Text>
        </Card.Content>
        <Card.Actions>
          <Button>share</Button>
          <Button>upload</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const enhance = withObservables(
  [],
  ({route}: {route: RouteProp<RideHistoryStack, 'Summary'>}) => {
    const {summaryId} = route.params;
    return {
      summary: db
        .get<RideSummaryModel>('ride_summary')
        .findAndObserve(summaryId),
    };
  },
);

export default enhance(RideSummary);
