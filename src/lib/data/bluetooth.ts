import {RealtimeDataModel, db} from '../../database';
import {
  cadenceMeter,
  getAllSensors,
  heartRateMonitor,
  powerMeter,
} from '../sensor';
import {getOrCreateRealtimeRecord} from './realtime';

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
  console.log(data.bpm);
  // When we get new HR data write it to realtime table
  let record = await getOrCreateRealtimeRecord();
  return db.write(async () => {
    return record.update(() => {
      record.heartRate = data.bpm;
      return record;
    });
  });
}

export function bleSensorService(
  sensorType: string,
  callback: (r: RealtimeDataModel) => Promise<RealtimeDataModel>,
) {
  let bleSensor: any = null;
  const start = async () => {
    console.log(`Starting ${sensorType} service worker.`);
    bleSensor = getSensorFromType(sensorType);

    let sensors = await getAllSensors();
    let sensor = findFirstSensorOfType(sensors, 'HeartRate');

    if (sensor === undefined) {
      throw new Error(`No ${sensorType} sensor found`);
    }

    try {
      bleSensor.address = sensor.address;
      await bleSensor.connect();
      bleSensor.subscribe(callback);
    } catch (error) {
      throw error;
    }
  };

  const stop = () => {
    console.log(`${sensorType} service: stopping`);
    bleSensor?.disconnect();
  };

  return {
    start,
    stop,
  };
}

export const hrService = bleSensorService('HeartRate', onHeartRateSensorEvent);
