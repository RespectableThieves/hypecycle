import {db, Q, RideModel} from '../../database';

export type RideAggregate = {
  avg_speed: number;
  avg_cadence: number;
  avg_hr: number;
  max_speed: number;
  max_cadence: number;
  max_altitude: number;
  max_hr: number;
  min_hr: number;
  distance: number;
  elapsed_time: number;
};

export async function getRideAggregates(
  ride: RideModel,
): Promise<RideAggregate> {
  // TODO: figure out how to test this func.
  const rawData = await db
    .get('history')
    .query(
      Q.unsafeSqlQuery(
        `select
        avg(speed) as avg_speed,
        avg(cadence) as avg_cadence,
        max(speed) as max_speed,
        max(cadence) as max_cadence,
        max(altitude) as max_altitude,
        max(heart_rate) as max_hr,        
        min(heart_rate) as min_hr,
        avg(heart_rate) as avg_hr,
        avg(cadence) as cadence_avg,
        last_value(distance) OVER (ORDER BY created_at) as distance,
        last_value(created_at) OVER (ORDER BY created_at) as last_created_at
        from history where ride_id = ?`,
        [ride.id],
      ),
    )
    .unsafeFetchRaw();

  const end = ride.endedAt || rawData[0].last_created_at;
  return {
    ...rawData[0],
    elapsed_time: (end - ride.startedAt) / 1000,
  };
}
