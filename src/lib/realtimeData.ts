import { LocationObject } from 'expo-location';
import { REALTIME_DATA_ID } from '../constants';
import { db, HistoryModel, RealtimeDataModel, RideModel } from '../database';
import { accumulateDistance } from './distance';

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
      record.heartRate = randomInt();
      record.cadence = randomInt();

      return record;
    });
  });
}

export async function onLocation(
  location: LocationObject,
): Promise<RealtimeDataModel> {
  console.log('New location', location);

  const realtimeData = await getOrCreateRealtimeRecord();
  // TODO: only accumulate distance when there is an active ride.
  const distance = accumulateDistance(realtimeData, location);
  console.log('accumulated distance: ', distance);
  const { speed, latitude, longitude, heading, altitude } = location.coords;

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

export async function onRideServiceEvent() {
  // this is responsible snapshotting realtime_data to the history table.
  const {
    speed,
    latitude,
    longitude,
    heading,
    altitude,
    distance,
    heartRate,
    instantPower,
    threeSecPower,
    tenSecPower,
    cadence,
    ride,
  } = await getOrCreateRealtimeRecord();

  return db.write(async () => {
    db.get<HistoryModel>('history').create(history => {
      history.ride = ride;
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
    });
  });
}

export async function snapshotService(callback: (r: RealtimeDataModel) => {}, interval: number) {
  const record = await getOrCreateRealtimeRecord();
  let timer: NodeJS.Timer
  const subscription = record.ride!.observe()

  if (record.ride?.id) {
    console.log("In progress!")
    // inprogress journey on boot
    timer = setInterval(() => callback(record), interval)
  }

  const observeable = subscription.subscribe((ride: RideModel | null) => {
    if (ride?.id) {
      // ride started. 
      if (!timer) {
        callback(record)
        timer = setInterval(() => callback(record), interval)
      }
    } else {
      if (timer) {
        // ride finished
        callback(record)
        clearInterval(timer)
      }
    }
  })

  const unsubscribe = () => {
    observeable.unsubscribe()
    clearInterval(timer)
  }

  return unsubscribe
}
