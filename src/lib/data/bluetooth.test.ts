
import { createSensor } from '../sensor';
import { bleSensorService, onHeartRateSensorEvent } from './bluetooth';
import { ble } from '../sensor';

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
    ble
    .requestPermissions()
    .then(() => {
    console.log('Ble permissions requested');
    })
    .then(() => {
    ble.start().catch((err: Error) => console.log(err));
    })
    .catch((err: Error) => console.log(err));
  });

describe('bluetooth sensor service', () => {
    jest.useFakeTimers();

  it('should connect to the first HR sensor in DB upon starting', async () => {
    // Create a test sensor in DB
    const newSensor: Sensor = {id: '1234', name: 'Test HRM', is_primary: true, sensorType: ['HeartRate'], type: 'bluetooth', address: '00:00:00:00'}
    const newDBSensor = await createSensor(newSensor.name, newSensor.address, newSensor.sensorType)
    // Create a 2nd test sensor in DB
    const secondSensor: Sensor = {id: '5678', name: 'Test Power meter', is_primary: true, sensorType: ['Power'], type: 'bluetooth', address: '10:10:10:10'}
    const secondDBSensor = await createSensor(secondSensor.name, newSensor.address, newSensor.sensorType)

    const worker = bleSensorService(ble,'HeartRate', onHeartRateSensorEvent);
    await worker.start();


    worker.stop();
  });

});
