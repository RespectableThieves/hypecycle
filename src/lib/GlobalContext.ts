import React from 'react';

const globalData = React.createContext({
  ble: null,
  powerMeter: null,
  heartRateMonitor: null,
  cadenceMeter: null,
});
export default globalData;
