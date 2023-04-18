import {RealtimeDataModel, SensorModel, db, Q} from '../../database';
import {cadenceMeter, heartRateMonitor, powerMeter} from '../sensor';
import {getOrCreateRealtimeRecord} from './realtime';
import {Subscription} from 'rxjs';

type SensorType = 'HeartRate' | 'CyclingPower' | 'CyclingSpeedAndCadence';
type StatusField = 'isPower' | 'isHeartRate' | 'isCadence';

function getSensorStatusFieldFromType(sensorType: SensorType): StatusField {
  switch (sensorType) {
    case 'HeartRate':
      return 'isHeartRate';

    case 'CyclingPower':
      return 'isPower';

    case 'CyclingSpeedAndCadence':
      return 'isCadence';

    default:
      console.log('Unknown sensor type');
      throw new Error('Unknown sensor type');
  }
}

function getSensorFromType(sensorType: SensorType) {
  switch (sensorType) {
    case 'HeartRate':
      return heartRateMonitor;

    case 'CyclingPower':
      return powerMeter;

    case 'CyclingSpeedAndCadence':
      return cadenceMeter;

    default:
      console.log('Unknown sensor type');
      throw new Error('Unknown sensor type');
  }
}

export async function onHeartRateSensorEvent(
  data: any,
): Promise<RealtimeDataModel> {
  // When we get new Power data write it to realtime table
  let record = await getOrCreateRealtimeRecord();
  if (record.heartRate === data.bpm) {
    // Only write to realtime table if we have a difference in value
    return record;
  }
  return db.write(async () => {
    return record.update(() => {
      record.heartRate = data.bpm;
      return record;
    });
  });
}

export async function onPowerSensorEvent(
  data: any,
): Promise<RealtimeDataModel> {
  // When we get new HR data write it to realtime table
  console.log(data);
  let record = await getOrCreateRealtimeRecord();
  if (record.instantPower === data.instantaneous_power) {
    // Only write to realtime table if we have a difference in value
    return record;
  }
  return db.write(async () => {
    return record.update(() => {
      record.instantPower = data.instantaneous_power;
      return record;
    });
  });
}

// TODO type react-native-cycling-sensors
export function sensorStatusService(sensor: any, sensorType: SensorType) {
  // This will watch a sensor and watch a sensor for x interval
  // to check it's connection and write that back to statusField.
  let timer: NodeJS.Timer | null;
  const statusField = getSensorStatusFieldFromType(sensorType);

  const start = async (interval: number) => {
    const record = await getOrCreateRealtimeRecord();

    timer = setInterval(async () => {
      // TODO I guess we should check in the db
      // for any connected sensors and only show the
      console.log(`checking ${sensorType} sensor`);
      try {
        // TODO we should upate react-native-cycling-sensors
        // const isConnected = await sensor.isPeripheralConnected()
        await db.write(async () => {
          return record.update(() => {
            if (record[statusField]) {
              record[statusField] = sensor.isConnected;
            }
            return record;
          });
        });
      } catch (err) {
        console.error("Couldn't update sensor status");
      }
    }, interval);
  };

  const stop = async () => {
    const record = await getOrCreateRealtimeRecord();

    console.log(`reseting ${statusField}`);
    await db.write(async () => {
      return record.update(() => {
        record[statusField] = null;
        return record;
      });
    });
    if (timer) {
      clearInterval(timer);
    }
  };

  return {
    start,
    stop,
  };
}

export function bleSensorService(
  sensorType: SensorType,
  callback: (r: RealtimeDataModel) => Promise<RealtimeDataModel>,
) {
  // TODO get types for react-native-cylcing-sensors
  let sensor = getSensorFromType(sensorType);
  let observeable: Subscription;
  const sensorStatusWorker = sensorStatusService(sensor, sensorType);

  const start = async () => {
    console.log(`Starting ${sensorType} service worker.`);
    // get the first sensor of sensorType
    const subscription = db
      .get<SensorModel>('sensor')
      ?.query(Q.where('sensor_type', Q.like(`%${sensorType}%`)))
      .observe();

    // Setup subscription for sensors added after start
    observeable = subscription?.subscribe({
      next: async (obsSensors: SensorModel[]) => {
        const [sensorModel] = obsSensors;

        if (sensorModel) {
          sensorStatusWorker.start(10000);
          // TODO. We need to ensure only one
          // of each type is running.
          console.log('observed new sensor: ', sensorModel);
          try {
            try {
              // Try connect to our BLE sensor
              sensor.address = sensorModel.address;
              await sensor.connect();
              // If we have connected we should start the sensor status service.
            } catch (error) {
              console.log('catch in connectToSensor was called');
              await sensor.disconnect().catch((err: any) => console.log(err));
              throw error;
            }
            // Start subscription on our sensor
            sensor.subscribe(callback);
          } catch (error) {
            console.log(`Error connecting to ${sensorType} sensor:`, error);
          }
        } else {
          // we don't have that sensor type in our db
          // so we should set the status to null.
          // to show we aren't tracking it.
          await sensorStatusWorker.stop();
        }
      },
      error: error => {
        console.log(`Error in ${sensorType} sensor subscription:`, error);
      },
    });
  };

  const stop = async () => {
    console.log(`${sensorType} service: stopping`);
    sensor?.unsubscribe();
    sensor?.disconnect();
    observeable?.unsubscribe();
    await sensorStatusWorker.stop();
  };

  return {
    start,
    stop,
  };
}

export const hrService = bleSensorService('HeartRate', onHeartRateSensorEvent);
export const powerService = bleSensorService(
  'CyclingPower',
  onPowerSensorEvent,
);
