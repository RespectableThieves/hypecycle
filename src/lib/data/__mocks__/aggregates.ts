import {db, Q, HistoryModel, RideModel} from '../../../database';
import {RideAggregate} from '../aggregates';

const avg =
  (length: number) =>
  (acc = 0, value = 0) => {
    return acc + value / length;
  };

// we mock getRideAggregates because the test LokiJS adapter can't run raw queries :/
// See: Diagnostic error: [Loki] Q.unsafeSqlQuery are not supported with LokiJSAdapter
export async function getRideAggregates(
  ride: RideModel,
): Promise<RideAggregate> {
  const records = await db
    .get<HistoryModel>('history')
    .query(Q.where('ride_id', ride.id));

  const speeds = records.map(r => r.speed).filter(r => r != null) as number[];
  const cadences = records
    .map(r => r.cadence)
    .filter(r => r != null) as number[];
  const altitudes = records
    .map(r => r.altitude)
    .filter(r => r != null) as number[];

  const lastRecord = records[records.length - 1];

  const end = ride.endedAt || lastRecord.createdAt;

  return {
    avgSpeed: speeds.reduce(avg(speeds.length), 0),
    avgPower: 0,
    avgCadence: 0,
    maxSpeed: Math.max(...speeds),
    maxPower: 0,
    maxCadence: Math.max(...cadences),
    maxAltitude: Math.max(...altitudes),
    maxHr: 0,
    minHr: 0,
    avgHr: 0,
    distance: lastRecord.distance,
    elapsedTime: (end - ride.startedAt) / 1000,
    lastCreatedAt: end,
  };
}
