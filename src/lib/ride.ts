import {db, RideModel, RideSummaryModel, Q} from '../database';
import {
  getOrCreateRealtimeRecord,
  getRideAggregates,
  generateTCX,
  saveTCX,
} from './data';
import * as FileSystem from 'expo-file-system';
import * as strava from './strava';

export class StravaNotConnected extends Error {
  constructor(message: string) {
    super(message);
    // Not required, but makes uncaught error messages nicer.
    this.name = 'StravaNotConnected';
  }
}

export async function startRide(): Promise<RideModel> {
  // TODO stop any current rides.
  const ride = await db.write(async () => {
    return db.get<RideModel>('ride').create(r => {
      r.startedAt = new Date();
      return r;
    });
  });

  const realtimeData = await getOrCreateRealtimeRecord();
  await db.write(() => {
    return realtimeData.update(() => {
      realtimeData.ride!.set(ride);
    });
  });

  return ride;
}

export async function stopRide(ride: RideModel): Promise<RideModel> {
  const stoppedRide = await db.write(async () => {
    return ride.update(() => {
      ride.endedAt = new Date();
      ride.isPaused = false;
      return ride;
    });
  });

  const realtimeData = await getOrCreateRealtimeRecord();

  await db.write(() => {
    return realtimeData.update(() => {
      realtimeData.ride!.id = null;
      realtimeData.distance = 0;
      realtimeData.movingTime = 0;
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
      r.ride.set(ride);
      r.fileURI = `${FileSystem.documentDirectory}${ride.id}.tcx`;
      r.maxHr = aggregates.maxHr;
      r.minHr = aggregates.minHr;
      r.avgSpeed = aggregates.avgSpeed;
      r.maxSpeed = aggregates.maxSpeed;
      r.avgCadence = aggregates.avgCadence;
      r.maxCadence = aggregates.maxCadence;
      r.distance = aggregates.distance;
      r.avgPower = aggregates.avgPower;
      r.maxPower = aggregates.maxPower;
      r.elapsedTime = aggregates.elapsedTime;
      r.movingTime = aggregates.movingTime;
    });
  });
}

export async function getRideSummary(
  rideId: RideModel['id'],
): Promise<RideSummaryModel> {
  const [rideSummary] = await db
    .get<RideSummaryModel>('ride_summary')
    .query(Q.where('ride_id', rideId), Q.take(1))
    .fetch();
  return rideSummary;
}

export async function rideUpload(summary: RideSummaryModel) {
  // then generate tcx file
  const tcx = await generateTCX(summary);
  // save the tcx file to disk
  const fileURI = await saveTCX(summary.fileURI, tcx);
  // load a fresh strava token
  const token = await strava.loadToken();

  if (!token) {
    // need to alert user.
    throw new StravaNotConnected(
      'Not uploading - not authenticated with strava.',
    );
  }

  // upload to strava.
  const upload = await strava.upload(token!, summary.ride.id, fileURI);

  // mark as uploaded.
  await summary.setStravaId(upload.id);
}

export async function onRideEnd(ride: RideModel) {
  // on ride end.
  // first save ride summary.
  const summary = await saveRideSummary(ride);

  return rideUpload(summary);
}
