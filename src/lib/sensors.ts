import {
  BleSensors,
  PowerMeter,
  HeartRateMonitor,
  CadenceMeter,
  // @ts-ignore
} from 'react-native-cycling-sensors';

export const ble = new BleSensors();
export const powerMeter = new PowerMeter();
export const heartRateMonitor = new HeartRateMonitor();
export const cadenceMeter = new CadenceMeter();
