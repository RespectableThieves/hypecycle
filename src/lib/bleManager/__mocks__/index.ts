import {PeripheralSensor} from '../bleSensors';

class DummySensor {
  _callbacks: any[];
  discoveryStopCallback: () => Promise<void>;
  sensorsDiscovered: PeripheralSensor[];

  constructor() {
    this.discoveryStopCallback = () => Promise.resolve();
    this.sensorsDiscovered = [];
    this._callbacks = [];
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

  subscribe(cb: any) {
    this._callbacks.push(cb);
    return Promise.resolve({remove: jest.fn()});
  }

  unsubscribe() {
    // TODO should we clear callback here?
    return true;
  }

  _emitBleData(data: any) {
    console.log('emitter called with: ', data);
    this._callbacks.forEach(cb => cb(data));
    return Promise.resolve();
  }

  clearAll() {
    this._callbacks = [];
  }
}

const BleSensors = DummySensor;

const PowerMeter = DummySensor;
const CadenceMeter = DummySensor;
const HeartRateMonitor = DummySensor;

export {BleSensors, PowerMeter, CadenceMeter, HeartRateMonitor};
