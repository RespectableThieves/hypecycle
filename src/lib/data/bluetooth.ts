import {RealtimeDataModel, SensorModel, db, Q} from '../../database';
import {cadenceMeter, heartRateMonitor, powerMeter} from '../sensor';
import {getOrCreateRealtimeRecord} from './realtime';
import {Subscription} from 'rxjs';

type SensorType = 'HeartRate' | 'CyclingPower' | 'CyclingSpeedAndCadence';

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

async function connectToSensor(
  sensorModel: SensorModel,
  sensor: any,
  sensorType: string,
  callback: {
    (r: RealtimeDataModel): Promise<RealtimeDataModel>;
    (r: RealtimeDataModel): Promise<RealtimeDataModel>;
  },
) {
  if (sensorModel === undefined) {
    throw new Error(`No ${sensorType} sensor found`);
  }

  try {
    // Try connect to our BLE sensor
    sensor.address = sensorModel.address;
    await sensor.connect();
  } catch (error) {
    console.log('catch in connectToSensor was called');
    await sensor.disconnect().catch((err: any) => console.log(err));
    throw error;
  }
  // Start subscription on our sensor
  sensor.subscribe(callback);
}

export function bleSensorService(
  sensorType: SensorType,
  callback: (r: RealtimeDataModel) => Promise<RealtimeDataModel>,
) {
  // TODO get types for react-native-cylcing-sensors
  let sensor: any = null;
  let observeable: Subscription;

  const start = async () => {
    console.log(`Starting ${sensorType} service worker.`);
    sensor = getSensorFromType(sensorType);
    // get the first sensor of sensorType
    const subscription = db
      .get<SensorModel>('sensor')
      ?.query(
        Q.unsafeSqlQuery(
          "select * from sensor where EXISTS (SELECT 1 FROM json_each(sensor_type) WHERE value = ?) and _status is not 'deleted' order by created_at DESC limit 1",
          [sensorType],
        ),
      )
      .observe();

    // Setup subscription for sensors added after start
    observeable = subscription?.subscribe({
      next: async (obsSensors: SensorModel[]) => {
        //const sensorModel = findFirstSensorOfType(obsSensors, sensorType);
        const [sensorModel] = obsSensors;

        if (sensorModel) {
          console.log('observed new sensor: ', sensorModel);
          try {
            await connectToSensor(sensorModel, sensor, sensorType, callback);
          } catch (error) {
            console.log(`Error connecting to ${sensorType} sensor:`, error);
          }
        }
      },
      error: error => {
        console.log(`Error in ${sensorType} sensor subscription:`, error);
      },
    });
  };

  const stop = () => {
    console.log(`${sensorType} service: stopping`);
    sensor?.unsubscribe();
    sensor?.disconnect();
    observeable?.unsubscribe();
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
