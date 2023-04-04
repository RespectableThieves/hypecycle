import {db, Q, HistoryModel, RideModel} from '../../database';
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
import {getRideAggregates} from './aggregates';

export async function getRideHistory(ride: RideModel) {
  return db.get<HistoryModel>('history').query(Q.where('ride_id', ride.id));
}

export async function generateTCX(ride: RideModel) {
  if (!ride.endedAt) {
    throw new Error(
      `Ride ${ride.id} is not complete - can't generate tcx file.`,
    );
  }

  const records = await getRideHistory(ride);
  const aggregates = await getRideAggregates(ride);

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

  const myLap: ActivityLap = new ActivityLap(new Date(ride.startedAt), {
    Calories: 0,
    Intensity: 'Active',
    TriggerMethod: 'Manual',
    DistanceMeters: records[records.length - 1]?.distance || 0,
    TotalTimeSeconds: (ride.endedAt! - ride.startedAt) / 1000,
    Track: new Track({trackPoints}),
    ...(aggregates.max_speed && {MaximumSpeed: aggregates.max_speed}),
    ...(aggregates.avg_cadence && {Cadence: aggregates.avg_cadence}),
    ...(aggregates.avg_hr && {
      AverageHeartRateBpm: new HeartRateInBeatsPerMinute({
        value: aggregates.avg_hr,
      }),
    }),
    ...(aggregates.max_hr && {
      MaximumHeartRateBpm: new HeartRateInBeatsPerMinute({
        value: aggregates.max_hr,
      }),
    }),
  });

  const tcxActivity = new Activity('Biking', {
    Id: new Date(ride.startedAt),
    Laps: [myLap],
    Notes: 'Hypecycle test ride',
  });
  const activityList = new ActivityList({activity: [tcxActivity]});

  const tcxObj = new TrainingCenterDatabase({activities: activityList});

  return tcxObj;
}
