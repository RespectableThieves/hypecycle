import {RealtimeDataModel} from '../../database';
import ElapsedTime from '../ElapsedTime';
import constants from '../../constants';

type Props = {
  realtimeData: RealtimeDataModel;
};

export default function MovingTime({realtimeData}: Props) {
  const movingTime =
    realtimeData.movingTime && realtimeData.ride?.id
      ? Date.now() - realtimeData.movingTime
      : undefined;

  return (
    <ElapsedTime
      title="Moving Time"
      startedAt={movingTime}
      run={
        realtimeData?.speed ? realtimeData.speed > constants.movingSpeed : false
      }
    />
  );
}
