import {db, Q, HistoryModel, RideSummaryModel, RideModel} from '../../database';
import {
  TrainingCenterDatabase,
  Activity,
  ActivityLap,
  Track,
  TrackPoint,
  Position,
  HeartRateBpm,
  TrackPointExtensions,
  ActivityList,
  HeartRateInBeatsPerMinute,
} from 'tcx-builder';
import * as FileSystem from 'expo-file-system';

export async function getRideHistory(rideId: RideModel['id']) {
  return db.get<HistoryModel>('history').query(Q.where('ride_id', rideId));
}

export async function generateTCX(rideSummary: RideSummaryModel) {
  const records = await getRideHistory(rideSummary.ride.id);

  const trackPoints: TrackPoint[] = [];
  for (const record of records) {
    trackPoints.push(
      new TrackPoint({
        time: new Date(record.createdAt),
        ...(record.latitude &&
          record.longitude && {
            position: new Position(record.latitude, record.longitude),
          }),
        ...(record.altitude && {altitudeMeters: record.altitude}),
        distanceMeters: record.distance,
        ...(record.heartRate && {
          heartRateBpm: new HeartRateBpm(record.heartRate),
        }),
        ...(record.cadence && {cadence: record.cadence}),
        sensorState: 'Present',
        ...(record.speed && {
          extensions: new TrackPointExtensions({
            Speed: record.speed,
          }),
        }),
      }),
    );
  }

  const myLap: ActivityLap = new ActivityLap(new Date(rideSummary.createdAt), {
    Calories: 0,
    Intensity: 'Active',
    TriggerMethod: 'Manual',
    DistanceMeters: records[records.length - 1]?.distance || 0,
    TotalTimeSeconds: rideSummary.elapsedTime,
    Track: new Track({trackPoints}),
    ...(rideSummary.maxSpeed && {MaximumSpeed: rideSummary.maxSpeed}),
    ...(rideSummary.avgCadence && {Cadence: rideSummary.avgCadence}),
    ...(rideSummary.avgHr && {
      AverageHeartRateBpm: new HeartRateInBeatsPerMinute({
        value: rideSummary.avgHr,
      }),
    }),
    ...(rideSummary.maxHr && {
      MaximumHeartRateBpm: new HeartRateInBeatsPerMinute({
        value: rideSummary.maxHr,
      }),
    }),
  });

  const tcxActivity = new Activity('Biking', {
    Id: new Date(rideSummary.createdAt),
    Laps: [myLap],
    Notes: `Hypecycle test ride - ${rideSummary.ride.id}`,
  });
  const activityList = new ActivityList({activity: [tcxActivity]});

  const tcxObj = new TrainingCenterDatabase({activities: activityList});

  return tcxObj;
}

export async function saveTCX(
  uri: string,
  tcx: TrainingCenterDatabase,
): Promise<string> {
  const xml = tcx.toXml();
  await FileSystem.writeAsStringAsync(uri, xml);
  return uri;
}
