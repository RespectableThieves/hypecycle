import {RideModel, HistoryModel, Q, db} from '../../database';
import withObservables from '@nozbe/with-observables';
import GeoJSONRoute from './GeoJSONRoute';
import {historyToGeoJSON} from '../../lib/data';

const RideRoute = ({data}: {data: HistoryModel[]}) => {
  const geojson = historyToGeoJSON(data);
  return <GeoJSONRoute geojson={geojson} />;
};

const enhance = withObservables([], ({rideId}: {rideId: RideModel['id']}) => ({
  data: db
    .get<HistoryModel>('history')
    .query(Q.where('ride_id', rideId), Q.sortBy('created_at', Q.desc))
    .observe(),
}));

export default enhance(RideRoute);
