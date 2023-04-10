import {Sensor} from '../../components/Sensor';
import {RealtimeDataModel, SensorModel, db} from '../../database';
import {
  cadenceMeter,
  getAllSensors,
  heartRateMonitor,
  powerMeter,
} from '../sensor';
import {getOrCreateRealtimeRecord} from './realtime';
import {Subscription} from 'rxjs';

type Sensor = {
  id: string;
  name: string;
  is_primary: boolean;
  sensorType: string[];
  type: string;
  address: string;
};

function getSensorFromType(sensorType: string) {
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

// Find first sensor of specific type in DB. Can't query it because table is JSON :/
function findFirstSensorOfType(
  sensors: Sensor[],
  sensorType: string,
): Sensor | undefined {
  return sensors.find(sensor => sensor.sensorType.includes(sensorType));
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
  sensor: Sensor | undefined,
  bleSensor: {address: any; connect: () => any; subscribe: (arg0: any) => void},
  sensorType: string,
  callback: {
    (r: RealtimeDataModel): Promise<RealtimeDataModel>;
    (r: RealtimeDataModel): Promise<RealtimeDataModel>;
  },
) {
  bleSensor = getSensorFromType(sensorType);
  if (sensor === undefined) {
    throw new Error(`No ${sensorType} sensor found`);
  }

  try {
    // Try connect to our BLE sensor
    bleSensor.address = sensor.address;
    await bleSensor.connect();

  } catch (error) {
    console.log('catch in connectToSensor was called');
    throw error;
  }
  // Start subscription on our sensor
  bleSensor.subscribe(callback);
  
}

export function bleSensorService(
  sensorType: string,
  callback: (r: RealtimeDataModel) => Promise<RealtimeDataModel>,
) {
  let bleSensor: any = null;
  let observeable: Subscription;

  const start = async () => {
    console.log(`Starting ${sensorType} service worker.`);

    let sensors = await getAllSensors();
    let sensor = findFirstSensorOfType(sensors, sensorType);

    const subscription = db.get<SensorModel>('sensor')?.query().observe();

    // Setup subscription for sensors added after start
    observeable = subscription?.subscribe({
      next: async (obsSensors: SensorModel[] | null) => {
        if (obsSensors && obsSensors.length > 0) {
          sensor = obsSensors.pop();
          console.log('observed new sensor: ', sensor);
          try {
            await connectToSensor(sensor, bleSensor, sensorType, callback);
          } catch (error) {
            console.log(`Error connecting to ${sensorType} sensor:`, error);
          }
        }
      },
      error: error => {
        console.log(`Error in ${sensorType} sensor subscription:`, error);
      },
    });

    try {
      await connectToSensor(sensor, bleSensor, sensorType, callback);
    } catch (error) {
      throw error;
    }
  };

  const stop = () => {
    console.log(`${sensorType} service: stopping`);
    bleSensor?.unsubscribe();
    bleSensor?.disconnect();
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
