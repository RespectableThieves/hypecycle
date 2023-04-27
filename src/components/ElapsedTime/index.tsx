import { useState } from 'react';
import { SimpleMetric } from '../SimpleMetric';
import useSetInterval from '../../hooks/useSetInterval';
import { formatTimestamp } from '../../lib/utils'

const ElapsedTime = ({ startedAt }: { startedAt: number | undefined }) => {
  const [elapsedTime, setElapsedTime] = useState<string>();

  useSetInterval(
    async () => {
      if (startedAt) {
        const t = formatTimestamp(Date.now() - startedAt)
        setElapsedTime(t);
      } else {
        setElapsedTime(undefined);
      }
    },
    startedAt ? 500 : null,
  );

  return (
    <SimpleMetric
      title="Elapsed Time"
      data={startedAt && elapsedTime
      }
      icon="watch"
    />
  );
};

export default ElapsedTime;
