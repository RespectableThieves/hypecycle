import {REALTIME_DATA_ID} from '../constants';
import {db, RealtimeDataModel} from '../database';

export async function getOrCreateRealtimeRecord(): Promise<RealtimeDataModel> {
  const collection = db.get<RealtimeDataModel>('realtime_data');

  try {
    const record = await collection.find(REALTIME_DATA_ID);
    return record;
  } catch (err) {
    // not found
    // create record on first boot.
    return db.write(async () => {
      return collection.create(r => {
        r._raw.id = REALTIME_DATA_ID;
        return r;
      });
    });
  }
}

function randomInt(max: number = 100) {
  return Math.floor(Math.random() * max);
}

// update the record on a timer
export async function updateRealTimeRecord(record: RealtimeDataModel) {
  return db.write(async () => {
    return record.update(() => {
      record.instantPower = randomInt();
      record.speed = randomInt();
      record.heartRate = randomInt();
      record.cadence = randomInt();
      record.distance = randomInt();
      return record;
    });
  });
}
