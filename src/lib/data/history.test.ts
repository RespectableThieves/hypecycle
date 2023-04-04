import {startRide, stopRide, saveRideSummary} from '../ride';
import {
  updateRealTimeRecordRandom,
  getOrCreateRealtimeRecord,
  onSnapshotEvent,
} from './realtime';
import {generateTCX} from './history';
import {TrainingCenterDatabase} from 'tcx-builder';

it('generate a tcx from ride summary', async () => {
  const snapshotCount = 5;
  const realtime = await getOrCreateRealtimeRecord();
  const ride = await startRide();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (let _x in [...Array(snapshotCount).keys()]) {
    await onSnapshotEvent();
    await updateRealTimeRecordRandom(realtime);
  }
  await stopRide(ride);
  const rideSummary = await saveRideSummary(ride);
  const tcx = await generateTCX(rideSummary);

  expect(tcx).toBeInstanceOf(TrainingCenterDatabase);
  expect(tcx.Activities?.Activity![0].Laps[0].Track?.TrackPoints.length).toBe(
    snapshotCount,
  );
});
