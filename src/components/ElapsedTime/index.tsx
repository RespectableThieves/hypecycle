import { useState } from 'react';
import { SimpleMetric, Props as SimpleMetricProps } from '../SimpleMetric';
import useSetInterval from '../../hooks/useSetInterval';
import { formatTimestamp } from '../../lib/utils';

const ElapsedTime = ({ startedAt, title = "Elapsed Time", icon = "watch" }: { startedAt: number | undefined, title?: SimpleMetricProps['title'], icon?: SimpleMetricProps['icon'] }) => {
  const [elapsedTime, setElapsedTime] = useState<string>();

  useSetInterval(
    async () => {
      if (startedAt) {
        const t = formatTimestamp(Date.now() - startedAt);
        setElapsedTime(t);
      } else {
        setElapsedTime(undefined);
      }
    },
    startedAt ? 500 : null,
  );

  return (
    <SimpleMetric
      title={title}
      data={startedAt && elapsedTime}
      icon={icon}
    />
  );
};

export default ElapsedTime;
