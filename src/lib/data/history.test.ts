import { startRide, stopRide, saveRideSummary } from '../ride';
import {
  updateRealTimeRecordRandom,
  getOrCreateRealtimeRecord,
  onSnapshotEvent,
} from './realtime';
import { generateTCX, saveTCX } from './history';
import { TrainingCenterDatabase } from 'tcx-builder';
import * as strava from '../strava';

it('generate a tcx from ride history and upload to strava', async () => {
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
  const fileURI = await saveTCX(rideSummary.fileURI, tcx);
  const token = await strava.loadToken()
  const upload = await strava.upload(token!, ride, fileURI);
  expect(upload.external_id).toBe(ride.id)
});
