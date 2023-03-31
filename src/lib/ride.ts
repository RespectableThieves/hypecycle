import { db, RideModel } from '../database';
import { Q } from '@nozbe/watermelondb';
import EventEmitter from 'events';
import { getOrCreateRealtimeRecord } from './realtimeData';

export const rideEventEmitter = new EventEmitter();

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
      realtimeData.ride!.set(ride);
    });
  });

  rideEventEmitter.emit('start', ride);
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

  rideEventEmitter.emit('stop', ride);
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

export type RideEvent = 'start' | 'stop' | 'tick';
export async function rideService(
  callback: (eventType: RideEvent, rideId: RideModel['id']) => {},
  tickInterval: number,
) {
  let timer: NodeJS.Timer | null = null;
  const inProgress = await db
    .get<RideModel>('ride')
    .query(Q.where('ended_at', null))
    .fetch();

  if (inProgress.length > 0) {
    const [ride] = inProgress;
    // service booted with an inProgress ride
    timer = setInterval(() => callback('tick', ride.id), tickInterval);
  }

  rideEventEmitter.on('start', ride => {
    if (!timer) {
      // callback immediately
      callback('start', ride.id);
      // then start timer
      timer = setInterval(() => callback('tick', ride.id), tickInterval);
    }
  });

  rideEventEmitter.on('stop', ride => {
    callback('stop', ride.id);
    if (timer) {
      clearInterval(timer);
    }
  });

  return () => {
    if (timer) {
      clearInterval(timer);
    }
  };
}
