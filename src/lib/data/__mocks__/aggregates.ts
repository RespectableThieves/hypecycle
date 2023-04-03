import {db, Q, HistoryModel, RideModel} from '../../../database';

const avg =
  (length: number) =>
  (acc = 0, value = 0) => {
    return acc + value / length;
  };

// we mock getRideAggregates because the test LokiJS adapter can't run raw queries :/
// See: Diagnostic error: [Loki] Q.unsafeSqlQuery are not supported with LokiJSAdapter
export async function getRideAggregates(ride: RideModel): Promise<any> {
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

  return {
    avg_speed: speeds.map(avg(speeds.length), 0),
    avg_power: 0,
    avg_cadence: 0,
    max_speed: Math.max(...speeds),
    max_power: 0,
    max_cadence: Math.max(...cadences),
    max_altitude: Math.max(...altitudes),
    max_hr: 0,
    min_hr: 0,
  };
}
