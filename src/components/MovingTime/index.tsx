import { useState } from 'react';
import { SimpleMetric } from '../SimpleMetric';
import useSetInterval from '../../hooks/useSetInterval';
import { formatTimestamp } from '../../lib/utils'
import { RealtimeDataModel } from '../../database'

const MovingTime = ({ realtimeData }: { realtimeData: RealtimeDataModel }) => {
  // const [elapsedTime, setElapsedTime] = useState<string>();

  // useSetInterval(
  //   async () => {
  //     if (startedAt) {
  //       const t = formatTimestamp(Date.now() - startedAt)
  //       setElapsedTime(t);
  //     } else {
  //       setElapsedTime(undefined);
  //     }
  //   },
  //   startedAt ? 500 : null,
  // );

  return (
    <SimpleMetric
      title="Moving Time"
      data={realtimeData.movingTime}
      icon="watch"
    />
  );
};

export default MovingTime;
