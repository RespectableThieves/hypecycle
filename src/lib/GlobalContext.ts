import React from 'react';
import {
  BleSensors,
  PowerMeter,
  CadenceMeter,
  HeartRateMonitor,
  // @ts-ignore
} from 'react-native-cycling-sensors';

type GlobalData = {
  ble: BleSensors;
  powerMeter: PowerMeter;
  cadenceMeter: CadenceMeter;
  heartRateMonitor: HeartRateMonitor;
};

const globalData = React.createContext<GlobalData>({
  ble: null,
  powerMeter: null,
  heartRateMonitor: null,
  cadenceMeter: null,
});
export default globalData;
