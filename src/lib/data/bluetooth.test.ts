import {createSensor} from '../sensor';
import {bleSensorService} from './bluetooth';
import {heartRateMonitor} from '../sensor';

type Sensor = {
  id: string;
  name: string;
  is_primary: boolean;
  sensorType: string[];
  type: string;
  address: string;
};

afterAll(async () => {
  heartRateMonitor.clearAll();
});

describe('bluetooth sensor service', () => {
  it('should connect to the first HR sensor in DB upon starting', async () => {
    // Create a test sensor in DB
    const newSensor: Sensor = {
      id: '1234',
      name: 'Test HRM',
      is_primary: true,
      sensorType: ['HeartRate'],
      type: 'bluetooth',
      address: '00:00:00:00',
    };
    await createSensor(newSensor.name, newSensor.address, newSensor.sensorType);

    const mockCallback = jest.fn();
    const hrService = bleSensorService('HeartRate', mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();

    // Start the hrService
    await hrService.start();

    heartRateMonitor._emitBleData({bpm: 100});
    expect(mockCallback).toHaveBeenCalledTimes(1);
    hrService.stop();
  });

  it('should connect to a second HR sensor in DB after starting', async () => {
    // Create a test sensor in DB
    const newSensor: Sensor = {
      id: '1234',
      name: 'Test HRM',
      is_primary: true,
      sensorType: ['HeartRate'],
      type: 'bluetooth',
      address: '00:00:00:00',
    };
    await createSensor(newSensor.name, newSensor.address, newSensor.sensorType);

    const mockCallback = jest.fn();
    const hrService = bleSensorService('HeartRate', mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();

    // Start the hrService
    await hrService.start();
    // now save another sensor
    await createSensor('Test HRM 2', '11:11:11:11', newSensor.sensorType);

    // Not sure what should happen when two HR monitors are connected?
    // But for now we'll check that the new sensor is subscribed.
    heartRateMonitor._emitBleData({bpm: 100});
    expect(mockCallback).toHaveBeenCalledTimes(2);
    hrService.stop();
  });

  it('should throw an error when there is no HeartRate sensor', async () => {
    const mockCallback = jest.fn();
    const hrService = bleSensorService('HeartRate', mockCallback);
    const newSensor: Sensor = {
      id: '1234',
      name: 'Test Cycling Power',
      is_primary: true,
      sensorType: ['Cycling Power'],
      type: 'bluetooth',
      address: '00:00:00:00',
    };
    await createSensor(newSensor.name, newSensor.address, newSensor.sensorType);

    try {
      await hrService.start();
    } catch (error) {
      expect(error).toEqual(new Error('No HeartRate sensor found'));
    }

    expect(mockCallback).not.toHaveBeenCalled();
    hrService.stop();
  });
});
