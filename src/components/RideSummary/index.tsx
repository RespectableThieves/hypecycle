import {
  RideModel,
  RideSummaryModel,
  db
} from '../../database'
import withObservables from '@nozbe/with-observables';
import {
  View

} from 'react-native'
import {
} from 'react-native-paper'


function RideSummary({ summary, ride }) {
  return (<View>
    <Text>{ride.id}</Text>
  </View>)
}

const enhance = withObservables([], async ({ rideId }: { rideId: RideModel['id'] }) => {
  const summary = await db.get<RideSummaryModel>('ride_summary').find(rideId)

  return {
    ride: summary.ride,
    summary: summary,
  };
})

export default enhance(RideSummary)
