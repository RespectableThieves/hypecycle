import {
  RideSummaryModel,
  db
} from '../../database'
import withObservables from '@nozbe/with-observables';
import {
  Button, Card
} from 'react-native-paper'
import
MapRoute
  from '../MapRoute'
import {
  View
} from 'react-native'
import {
  RouteProp
} from '@react-navigation/native'
import {
  RideHistoryStack
} from '../../navigators/RideHistory'

function RideSummary({ summary }: { summary: RideSummaryModel }) {
  return (
    <View style={{
      flex: 1,
    }}>
      <MapRoute rideId={summary.ride.id} />
      <Card style={{ marginTop: -5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <Card.Title title={summary.ride.id} subtitle={summary.createdAt.toString()} />
        <Card.Content>
        </Card.Content>
        <Card.Actions>
          <Button>share</Button>
          <Button>upload</Button>
        </Card.Actions>
      </Card>
    </View>
  )
}

const enhance = withObservables([], ({ route }: { route: RouteProp<RideHistoryStack, 'Summary'> }) => {
  const { summaryId } = route.params;
  return {
    summary: db.get<RideSummaryModel>('ride_summary').findAndObserve(summaryId),
  };
})

export default enhance(RideSummary)
