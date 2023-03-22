import renderer, {
  ReactTestRenderer,
  ReactTestInstance,
} from 'react-test-renderer';
import {FlatList} from 'react-native';
import {Button, Text} from 'react-native-paper';

import App from '../../../App';
import {navigate} from '../../lib/navigation';
import {ble} from '../../lib/sensors';
import Sensors from './';
import {dataBase} from '../../database';
import {createSensor, getAllSensors} from '../../database/sensor/utils';
import SensorModel from '../../database/model/sensorModel';
import {Sensor} from '../../components/Sensor';

let screen!: ReactTestInstance;
let tree!: ReactTestRenderer;
let records: SensorModel[] = [];

beforeEach(async () => {
  // becuase this screen relies
  // on providers like globalData
  // navigation etc. We'll just load
  // the app then navigate to it.
  await renderer.act(async () => {
    tree = renderer.create(<App />);
  });

  renderer.act(() => {
    navigate('Sensors');
  });

  screen = tree.root.findByType(Sensors);
});

afterEach(async () => {
  await dataBase.write(async () => {
    for (let record of records) {
      await record.destroyPermanently();
    }
  });

  tree.unmount();
});

it('Screen renders correctly when there ARE NO sensors', async () => {
  // check that it renders when a new item is added to the db.
  const text = screen.findByType(Text);
  expect(text.props.children).toBe('No Connected Sensors yet... Try add some!');
});

it('Screen renders correctly when there ARE sensors', async () => {
  // check that it renders when a new item is added to the db.
  const list = screen.findByType(FlatList);
  const sensorName = 'ble-1234';

  const sensors = screen.findAllByType(Sensor);
  expect(sensors.length).toBe(0);

  await renderer.act(async () => {
    const record = await createSensor(sensorName, 'xyz', []);
    records.push(record);
    list.props.onRefresh();
  });

  const sensor = screen.findByType(Sensor);

  expect(sensor.props.data.name).toBe(sensorName);
});

it('Screen allows removing a sensor', async () => {
  const list = screen.findByType(FlatList);
  const sensorName = 'ble-1234';

  // add a sensor
  await renderer.act(async () => {
    const record = await createSensor(sensorName, 'xyz', []);
    records.push(record);
    list.props.onRefresh();
  });

  // check it's there
  const sensor = screen.findByType(Sensor);
  expect(sensor.props.data.name).toBe(sensorName);

  // remove sensor + refresh
  await renderer.act(async () => {
    await sensor.props.onAction();
    list.props.onRefresh();
  });

  // check it's gone
  const sensors = screen.findAllByType(Sensor);
  expect(sensors.length).toBe(0);
});

it('Screen allows adding a sensor', async () => {
  // 1. click add bring up modal
  // 2. press scan
  // 3. pair item from discovery list
  // 4. check sensor is saved to db
  // 5. and is loaded on original screen.
  const sensorName = 'a-heart-rate-monitor';
  const addButton = tree.root.findByType(Button);

  await renderer.act(async () => {
    await addButton.props.onPress();
  });

  // look for empty list text
  const text = tree.root
    .findAllByType(Text)
    .find(t => t.props.children === 'No sensors found, run a scan!');
  expect(text).toBeTruthy();

  const scanButton = tree.root.findByProps({id: 'discovery-modal-scan'});
  ble.sensorsDiscovered = [
    {
      id: 'ble-xyz',
      adress: '1.1.1.1',
      name: sensorName,
      is_primary: true,
      type: 'HeartRate',
      sensorType: ['HeartRate'],
    },
  ];

  const s = tree.root.findAllByType(Sensor);
  expect(s.length).toBe(0);

  await renderer.act(async () => {
    await scanButton.props.onPress();
    await ble.stopSensorDiscovery();
  });

  const discoveredSensors = tree.root.findAllByType(Sensor);
  expect(discoveredSensors.length).toBe(1);

  const sensor = discoveredSensors[0];

  // Now pair the sensor
  await renderer.act(async () => {
    // pair
    await sensor.props.onAction();
  });

  const closeButton = tree.root.findByProps({id: 'discovery-modal-close'});
  await renderer.act(async () => {
    // dismiss modal
    await closeButton.props.onPress();
  });

  // finally check it's in the db and is rendered.
  const [sensorRow] = await getAllSensors();
  expect(sensorRow.name).toBe(sensorName);

  const newSensors = screen.findAllByType(Sensor);
  expect(newSensors.length).toBe(1);
});