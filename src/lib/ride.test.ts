import {getRideSummary, stopRide, startRide, onRideEnd} from './ride';
import {
  getOrCreateRealtimeRecord,
  onSnapshotEvent,
  updateRealTimeRecordRandom,
} from './data';
import * as strava from './strava';
import * as FileSystem from 'expo-file-system';

describe('ride and realtime db interactions', () => {
  it('should write to realtime_data.ride_id on stop start', async () => {
    let realtimeData = await getOrCreateRealtimeRecord();
    expect(realtimeData.ride?.id).toBeNull();
    const ride = await startRide();
    expect(realtimeData.ride?.id).toBeTruthy();
    await stopRide(ride);
    expect(realtimeData.ride?.id).toBeNull();
  });
});

describe('onRideEnd', () => {
  jest.useFakeTimers();
  it('should save rideSummary, save tcx file, upload to strava and update rideSummary.stravaId', async () => {
    const snapshotCount = 5;
    const realtime = await getOrCreateRealtimeRecord();
    const ride = await startRide();

    jest.advanceTimersByTime(3000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let _x in [...Array(snapshotCount).keys()]) {
      await onSnapshotEvent();
      await updateRealTimeRecordRandom(realtime);
      jest.advanceTimersByTime(3000);
    }

    jest.advanceTimersByTime(3000);
    await stopRide(ride);
    await onRideEnd(ride);

    // check we write the rideSummary + stravaID
    // and the tcx file is saved + uploaded.
    const rideSummary = await getRideSummary(ride.id);

    expect(rideSummary.stravaId).toBe(1);
    expect(rideSummary.distance).toBeGreaterThan(0);
    expect(rideSummary.elapsedTime).toBe(
      (ride.endedAt!.getTime() - ride.startedAt.getTime()) / 1000,
    );
    expect(rideSummary.fileURI).toContain(ride.id);
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      rideSummary.fileURI,
      expect.any(String),
    );
    expect(strava.upload).toHaveBeenCalledTimes(1);
  }, 50000);
});
