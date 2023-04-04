import { db, RideModel, RideSummaryModel } from '../database';
import { getOrCreateRealtimeRecord, getRideAggregates } from './data';
import * as FileSystem from 'expo-file-system';

export async function startRide(): Promise<RideModel> {
  // TODO stop any current rides.
  const ride = await db.write(async () => {
    return db.get<RideModel>('ride').create(r => {
      r.startedAt = Date.now();
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
      ride.endedAt = Date.now();
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

export async function saveRideSummary(ride: RideModel) {
  const aggregates = await getRideAggregates(ride);

  // saves ride summary to the db.
  return db.write(() => {
    return db.get<RideSummaryModel>('ride_summary').create(r => {
      r.ride.set(ride)
      r.fileURI = `${FileSystem.documentDirectory}/${ride.id}`;
      r.maxHr = aggregates.max_hr
      r.minHr = aggregates.min_hr
      r.avgPower = aggregates.avg_power
      r.maxPower = aggregates.max_power
      r.avgSpeed = aggregates.avg_speed
      r.maxSpeed = aggregates.max_speed
      r.avgCadence = aggregates.avg_cadence
      r.maxCadence = aggregates.max_cadence
      r.distance = aggregates.distance
      r.elapsedTime = aggregates.elapsed_time
    });
  });
}
