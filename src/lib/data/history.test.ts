import {startRide, stopRide, saveRideSummary} from '../ride';
import {
  updateRealTimeRecordRandom,
  getOrCreateRealtimeRecord,
  onSnapshotEvent,
} from './realtime';
import {generateTCX} from './history';
import {TrainingCenterDatabase} from 'tcx-builder';

it('generate a tcx from ride summary', async () => {
  jest.useFakeTimers();
  const snapshotCount = 5;
  const realtime = await getOrCreateRealtimeRecord();
  const ride = await startRide();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (let _x in [...Array(snapshotCount).keys()]) {
    jest.advanceTimersByTime(3000);
    await updateRealTimeRecordRandom(realtime);
    await onSnapshotEvent();
  }
  await stopRide(ride);
  const rideSummary = await saveRideSummary(ride);
  const tcx = await generateTCX(rideSummary);

  expect(tcx).toBeInstanceOf(TrainingCenterDatabase);
  const trackPoints = tcx.Activities?.Activity![0].Laps[0].Track!.TrackPoints!;
  expect(trackPoints.length).toBe(snapshotCount);

  expect(trackPoints[trackPoints.length - 1].Cadence).toBe(realtime.cadence);
  expect(trackPoints[trackPoints.length - 1].Extensions?.Watts).toBe(
    realtime.instantPower,
  );
}, 20000);
