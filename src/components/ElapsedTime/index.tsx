import {useState} from 'react';
import {SimpleMetric} from '../SimpleMetric';
import useSetInterval from '../../hooks/useSetInterval';

function pad(n: number) {
  return ('0' + n).slice(-2);
}

const ElapsedTime = ({startedAt}: {startedAt: number | undefined}) => {
  const [elapsedTime, setElapsedTime] = useState<string>();

  useSetInterval(
    async () => {
      if (startedAt) {
        let diff = Math.floor((Date.now() - startedAt) / 1000);
        const hours = Math.floor(diff / 3600);
        diff -= hours * 3600;
        const minutes = Math.floor(diff / 60);
        diff -= minutes * 60;

        setElapsedTime(`${pad(hours)}:${pad(minutes)}:${pad(diff)}`);
      } else {
        setElapsedTime(undefined);
      }
    },
    startedAt ? 500 : null,
  );

  return (
    <SimpleMetric
      title="Elapsed Time"
      data={startedAt && elapsedTime}
      icon="watch"
    />
  );
};

export default ElapsedTime;
