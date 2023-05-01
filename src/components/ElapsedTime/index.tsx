import {useState} from 'react';
import {SimpleMetric, Props as SimpleMetricProps} from '../SimpleMetric';
import useSetInterval from '../../hooks/useSetInterval';
import {formatTimestamp} from '../../lib/utils';

const ElapsedTime = ({
  startedAt,
  run = true,
  title = 'Elapsed Time',
  icon = 'watch',
}: {
  startedAt: number | undefined;
  run?: boolean;
  title?: SimpleMetricProps['title'];
  icon?: SimpleMetricProps['icon'];
}) => {
  const formated = startedAt
    ? formatTimestamp(Date.now() - startedAt)
    : undefined;
  const [elapsedTime, setElapsedTime] = useState<string | undefined>(formated);

  useSetInterval(
    async () => {
      if (startedAt && run) {
        const t = formatTimestamp(Date.now() - startedAt);
        setElapsedTime(t);
      } else {
        setElapsedTime(undefined);
      }
    },
    startedAt && run ? 500 : null,
  );

  return (
    <SimpleMetric title={title} data={startedAt && elapsedTime} icon={icon} />
  );
};

export default ElapsedTime;
