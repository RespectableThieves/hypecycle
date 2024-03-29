import {LocationObject} from 'expo-location';
import Constants from '../../constants';
import {Subscription} from 'rxjs';
import {db, HistoryModel, RealtimeDataModel, RideModel} from '../../database';
import {accumulateDistance} from './distance';
import {accumulateMovingTime} from './movingTime';

export async function getOrCreateRealtimeRecord(): Promise<RealtimeDataModel> {
  const collection = db.get<RealtimeDataModel>('realtime_data');

  try {
    const record = await collection.find(Constants.realtimeDataId);
    return record;
  } catch (err) {
    // not found
    // create record on first boot.
    return db.write(async () => {
      return collection.create(r => {
        r._raw.id = Constants.realtimeDataId;
        return r;
      });
    });
  }
}

function randomInt(max: number = 100) {
  return Math.floor(Math.random() * max);
}

// used for tests
export async function updateRealTimeRecordRandom(record: RealtimeDataModel) {
  return db.write(async () => {
    return record.update(() => {
      record.instantPower = randomInt();
      record.heartRate = randomInt();
      record.cadence = randomInt();
      record.distance = randomInt();
      record.latitude = randomInt();
      record.longitude = randomInt();
      record.altitude = randomInt();
      record.speed = randomInt();
      record.instantPower = randomInt();

      return record;
    });
  });
}

export async function onLocation(
  location: LocationObject,
): Promise<RealtimeDataModel> {
  console.log('New location', location);

  const realtimeData = await getOrCreateRealtimeRecord();
  const distance = realtimeData.ride?.id
    ? accumulateDistance(realtimeData, location)
    : 0;

  const movingTime = realtimeData.ride?.id
    ? await accumulateMovingTime(realtimeData, location)
    : 0;

  console.log('accumulated distance: ', distance);
  console.log('accumulated movingTime: ', movingTime);

  const {speed, latitude, longitude, heading, altitude} = location.coords;

  return db.write(async () => {
    return realtimeData.update(record => {
      record.speed = speed ? speed : 0;
      record.latitude = latitude;
      record.longitude = longitude;
      record.heading = heading;
      record.altitude = altitude;
      record.distance = distance;
      record.movingTime = movingTime;
      record.lastLocationAt = new Date(location.timestamp);

      return record;
    });
  });
}

export async function onSnapshotEvent() {
  // this is responsible snapshotting realtime_data to the history table.
  const {
    speed,
    latitude,
    longitude,
    heading,
    altitude,
    distance,
    movingTime,
    heartRate,
    instantPower,
    threeSecPower,
    tenSecPower,
    cadence,
    ride,
  } = await getOrCreateRealtimeRecord();

  if (ride?.id) {
    console.log('snapshoting realtime data', ride?.id);

    await db.write(function historySnapshot() {
      return db.get<HistoryModel>('history').create(history => {
        history.ride!.id = ride?.id;
        history.speed = speed;
        history.latitude = latitude;
        history.longitude = longitude;
        history.heading = heading;
        history.altitude = altitude;
        history.distance = distance;
        history.heartRate = heartRate;
        history.instantPower = instantPower;
        history.threeSecPower = threeSecPower;
        history.tenSecPower = tenSecPower;
        history.cadence = cadence;
        history.movingTime = movingTime;
      });
    });
  }
}

export function snapshotService(
  callback: (r: RealtimeDataModel) => Promise<void>,
) {
  let timer: NodeJS.Timer | null;
  let observeable: Subscription;

  const start = async (interval: number) => {
    const record = await getOrCreateRealtimeRecord();
    const subscription = record.ride!.observe();
    console.log('snapshot service: starting');

    if (record.ride?.id) {
      // inprogress journey on boot
      console.log('snapshot service: resuming');

      timer = setInterval(async () => {
        await callback(record);
      }, interval);
    }

    observeable = subscription.subscribe(async (ride: RideModel | null) => {
      if (ride?.id) {
        // ride started.
        if (!timer) {
          console.log('snapshot service: resuming');
          await callback(record);
          timer = setInterval(async () => {
            await callback(record);
          }, interval);
        }
      } else {
        if (timer) {
          // ride finished
          console.log('snapshot service: pausing');
          await callback(record);
          clearInterval(timer);
          timer = null;
        }
      }
    });
  };

  const stop = () => {
    console.log('snapshot service: stopping');
    if (observeable) {
      observeable.unsubscribe();
    }
    if (timer) {
      clearInterval(timer);
    }
  };

  return {
    start,
    stop,
  };
}

export const snapshotWorker = snapshotService(onSnapshotEvent);

export function simulateRealtimeDataService() {
  // simulates random data for realtime data
  let timer: NodeJS.Timer | null;

  const start = async (interval: number) => {
    const realtimeRecord = await getOrCreateRealtimeRecord();
    timer = setInterval(async () => {
      await updateRealTimeRecordRandom(realtimeRecord);
      console.log('randomly updated realtime data');
    }, interval);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  return {
    start,
    stop,
  };
}

export const simulateRealtimeDataWorker = simulateRealtimeDataService();
