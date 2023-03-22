import {SensorProps} from '../src/components/Sensor';

class DummySensor {
  discoveryStopCallback: () => Promise<void>;
  sensorsDiscovered: SensorProps[];

  constructor() {
    this.discoveryStopCallback = () => Promise.resolve();
    this.sensorsDiscovered = [];
  }

  connect() {
    return Promise.resolve(true);
  }

  disconnect(_address: string) {
    return Promise.resolve(true);
  }

  checkState() {
    return true;
  }

  start() {
    return Promise.resolve(true);
  }

  requestPermissions() {
    return Promise.resolve(true);
  }

  startSensorDiscovery() {
    return Promise.resolve(true);
  }

  stopSensorDiscovery() {
    // this is just implemented for tests.
    return this.discoveryStopCallback();
  }

  subscribeToDiscoveryStop(cb: () => Promise<void>) {
    this.discoveryStopCallback = cb;
  }

  getDiscoveredSensors() {
    return Promise.resolve(this.sensorsDiscovered);
  }
}

const BleSensors = DummySensor;

const PowerMeter = DummySensor;
const CadenceMeter = DummySensor;
const HeartRateMonitor = DummySensor;

export {BleSensors, PowerMeter, CadenceMeter, HeartRateMonitor};
