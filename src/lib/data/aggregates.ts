import {db, Q, RideModel} from '../../database';

export type RideAggregate = {
  avgSpeed: number;
  avgCadence: number;
  avgHr: number;
  maxSpeed: number;
  maxCadence: number;
  maxAltitude: number;
  maxHr: number;
  minHr: number;
  distance: number;
  lastCreatedAt: number;
  elapsedTime: number;
  maxPower: number;
  avgPower: number;
};

export async function getRideAggregates(
  ride: RideModel,
): Promise<RideAggregate> {
  // TODO: figure out how to test this func.
  const rawData: Omit<RideAggregate, 'elapsedTime'>[] = await db
    .get('history')
    .query(
      Q.unsafeSqlQuery(
        `select
        avg(speed) as avgSpeed,
        avg(cadence) as avgCadence,
        max(speed) as maxSpeed,
        max(cadence) as maxCadence,
        max(altitude) as maxAltitude,
        max(heart_rate) as maxHr,        
        min(heart_rate) as minHr,
        avg(heart_rate) as avgHr,
        avg(cadence) as cadenceAvg,
        avg(instant_power) as avgPower,
        max(instant_power) as maxPower,
        last_value(distance) OVER (ORDER BY created_at) as distance,
        last_value(created_at) OVER (ORDER BY created_at) as lastCreatedAt
        from history where ride_id = ?`,
        [ride.id],
      ),
    )
    .unsafeFetchRaw();

  const end = ride.endedAt || rawData[0].lastCreatedAt;
  return {
    ...rawData[0],
    elapsedTime: (end - ride.startedAt) / 1000,
  };
}
