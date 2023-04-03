import {db, Q, RideModel} from '../../database';

export type RideAggregate = {
  avg_speed: number;
  avg_power: number;
  avg_cadence: number;
  avg_hr: number;
  max_speed: number;
  max_power: number;
  max_cadence: number;
  max_altitude: number;
  max_hr: number;
  min_hr: number;
};

export async function getRideAggregates(
  ride: RideModel,
): Promise<RideAggregate> {
  // TODO: figure out how to test this func.
  const rawData: RideAggregate[] = await db
    .get('history')
    .query(
      Q.unsafeSqlQuery(
        `select
        avg(speed) as avg_speed,
        avg(power) as avg_power,
        avg(cadence) as avg_cadence,
        max(speed) as max_speed,
        max(power) as max_power,
        max(cadence) as max_cadence,
        max(altitude) as max_altitude,
        
        avg(cadence) as cadence_avg from history where ride_id = ?`,
        [ride.id],
      ),
    )
    .unsafeFetchRaw();

  return rawData[0];
}