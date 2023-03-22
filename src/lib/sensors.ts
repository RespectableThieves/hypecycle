import {
  BleSensors,
  PowerMeter,
  HeartRateMonitor,
  CadenceMeter,
  // @ts-ignore
} from 'react-native-cycling-sensors';
import {db, SensorModel} from '../database';

export const ble = new BleSensors();
export const powerMeter = new PowerMeter();
export const heartRateMonitor = new HeartRateMonitor();
export const cadenceMeter = new CadenceMeter();

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

export async function createSensor(
  name: string,
  address: string,
  services: string[],
  type: string = 'bluetooth',
): Promise<SensorModel> {
  console.log('creating...');
  return db.write(async () => {
    return db
      .get<SensorModel>('sensor')
      .create(data => {
        data.name = name;
        data.type = type;
        data.address = address;
        data.sensorType = services;
        data.createdAt = new Date().getTime();
        console.log('creating sensor', data);
        return data;
      })
      .catch(err => {
        console.log('got error creating sensor: ', err);
        throw err;
      });
  });
}

export function getAllSensors() {
  return db.get<SensorModel>('sensor').query().fetch();
}
