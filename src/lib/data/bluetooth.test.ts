import {createSensor} from '../sensor';
import {bleSensorService} from './bluetooth';
import {ble} from '../sensor';

type Sensor = {
  id: string;
  name: string;
  is_primary: boolean;
  sensorType: string[];
  type: string;
  address: string;
};

beforeEach(async () => {
  // Create our global ble object
  try {
    await ble.requestPermissions();
    await ble.start();
  } catch (err) {
    throw new Error('problem starting ble');
  }
  jest.clearAllMocks();
});

describe('bluetooth sensor service', () => {
  jest.useFakeTimers();

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

    // Wait for the service to complete its setup, then emit the data
    setTimeout(() => {
      ble._emitBleData({bpm: 100});
      expect(mockCallback).toHaveBeenCalledTimes(1);

      hrService.stop();
      ble.clearAll();
    }, 100);

    hrService.stop();
    ble.clearAll();
  });

  it('should throw an error when there is no HeartRate sensor', async () => {
    const mockCallback = jest.fn();
    const hrService = bleSensorService('HeartRate', mockCallback);

    try {
      await hrService.start();
    } catch (error) {
      expect(error).toEqual(new Error('No HeartRate sensor found'));
    }

    expect(mockCallback).not.toHaveBeenCalled();
    hrService.stop();
    ble.clearAll();
  });
});
