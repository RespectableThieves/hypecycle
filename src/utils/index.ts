import {REALTIME_DATA_ID} from './contants';
import RealtimeDataModel from '../database/model/realtimeDataModel';
import {dataBase} from '../database';

export function bleCharacteristicToIconName(char: string): string {
  switch (char) {
    case 'Battery':
      // Battery Service
      return 'battery-bluetooth-variant';
    case 'HeartRate':
      // Heart rate service
      return 'heart-pulse';
    case 'CyclingPower':
      // Cycling Power
      return 'lightning-bolt';
    case 'CyclingSpeedAndCadence':
      // Cycling Speed And Cadence
      return 'unicycle';
    default:
      return 'ab-testing';
  }
}

export async function getOrCreateRealtimeRecord(): Promise<RealtimeDataModel> {
  const collection = dataBase.get<RealtimeDataModel>('realtime_data');

  try {
    const record = await collection.find(REALTIME_DATA_ID);
    return record;
  } catch (err) {
    // not found
    // create record on first boot.
    return dataBase.write(async () => {
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
  return dataBase.write(async () => {
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
