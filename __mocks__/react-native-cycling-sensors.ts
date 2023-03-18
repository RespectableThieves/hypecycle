class Sensor {
  checkState() {
    return true;
  }

  start() {
    return Promise.resolve(true);
  }

  requestPermissions() {
    return Promise.resolve(true);
  }
}

const BleSensors = Sensor;

const PowerMeter = Sensor;
const CadenceMeter = Sensor;
const HeartRateMonitor = Sensor;

export {BleSensors, PowerMeter, CadenceMeter, HeartRateMonitor};
