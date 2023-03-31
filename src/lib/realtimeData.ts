import {LocationObject} from 'expo-location';
import {REALTIME_DATA_ID} from '../constants';
import {db, RealtimeDataModel} from '../database';
import {accumulateDistance} from './distance';

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
      // record.speed = randomInt();
      record.heartRate = randomInt();
      record.cadence = randomInt();
      record.distance = randomInt();
      return record;
    });
  });
}

export async function onLocation(
  location: LocationObject,
): Promise<RealtimeDataModel> {
  console.log('New location', location);

  const realtimeData = await getOrCreateRealtimeRecord();
  const distance = accumulateDistance(realtimeData, location);
  const {speed, latitude, longitude, heading, altitude} = location.coords;

  return db.write(async () => {
    return realtimeData.update(record => {
      record.speed = speed;
      record.latitude = latitude;
      record.longitude = longitude;
      record.heading = heading;
      record.altitude = altitude;
      record.distance = distance;

      return record;
    });
  });
}
