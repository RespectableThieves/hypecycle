import {db, RideModel} from '../database';
import {getOrCreateRealtimeRecord} from './realtimeData';

export async function startRide(): Promise<RideModel> {
  // TODO stop any current rides.
  const ride = await db.write(async () => {
    return db.get<RideModel>('ride').create(r => {
      r.startedAt = new Date().getUTCMilliseconds();
      return r;
    });
  });

  const realtimeData = await getOrCreateRealtimeRecord();
  await db.write(() => {
    return realtimeData.update(() => {
      realtimeData.distance = 0;
      realtimeData.ride!.set(ride);
    });
  });

  return ride;
}

export async function stopRide(ride: RideModel): Promise<RideModel> {
  const stoppedRide = await db.write(async () => {
    return ride.update(() => {
      ride.endedAt = new Date().getUTCMilliseconds();
      ride.isPaused = false;
      return ride;
    });
  });

  const realtimeData = await getOrCreateRealtimeRecord();

  await db.write(() => {
    return realtimeData.update(() => {
      realtimeData.ride!.id = null;
    });
  });

  return stoppedRide;
}

export function pauseRide(ride: RideModel): Promise<RideModel> {
  return db.write(async () => {
    return ride.update(() => {
      ride.isPaused = true;
      return ride;
    });
  });
}

export function unpauseRide(ride: RideModel): Promise<RideModel> {
  return db.write(async () => {
    return ride.update(() => {
      ride.isPaused = false;
      return ride;
    });
  });
}
