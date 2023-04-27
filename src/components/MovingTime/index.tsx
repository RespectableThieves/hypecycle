import {SimpleMetric} from '../SimpleMetric';
import {formatTimestamp} from '../../lib/utils';
import {RealtimeDataModel} from '../../database';

const MovingTime = ({realtimeData}: {realtimeData: RealtimeDataModel}) => {
  return (
    <SimpleMetric
      title="Moving Time"
      data={formatTimestamp(realtimeData.movingTime)}
      icon="watch"
    />
  );
};

export default MovingTime;
