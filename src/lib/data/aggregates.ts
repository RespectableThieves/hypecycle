import { db, Q, RideModel } from '../../database';

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
  const rawData: Omit<RideAggregate, 'elapsedTime'>[] = await db
    .get('history')
    .query(
      Q.unsafeSqlQuery(
        `SELECT
        AVG(speed) AS avgSpeed,
        AVG(cadence) AS avgCadence,
        MAX(speed) AS maxSpeed,
        MAX(cadence) AS maxCadence,
        MAX(altitude) AS maxAltitude,
        MAX(heart_rate) AS maxHr,        
        MIN(heart_rate) AS minHr,
        AVG(heart_rate) AS avgHr,
        AVG(cadence) AS cadenceAvg,
        AVG(instant_power) AS avgPower,
        MAX(instant_power) AS maxPower,
        (SELECT distance FROM history WHERE ride_id = ? ORDER BY created_at DESC LIMIT 1) AS distance,
        (SELECT created_at FROM history WHERE ride_id = ? ORDER BY created_at DESC LIMIT 1) AS lastCreatedAt

        FROM history
        WHERE ride_id = ?
    `,
        [ride.id, ride.id, ride.id],
      ),
    )
    .unsafeFetchRaw();

  console.log(ride.id, rawData)

  const end = ride.endedAt || rawData[0].lastCreatedAt || ride.startedAt;
  return {
    ...rawData[0],
    elapsedTime: (end - ride.startedAt) / 1000,
  };
}
