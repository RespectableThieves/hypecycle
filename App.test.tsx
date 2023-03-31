import App from './App';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
import Home from './src/screens/Home';
import * as Location from 'expo-location';
import {getOrCreateRealtimeRecord} from './src/lib/realtimeData';

it('App renders correctly for signed user.', async () => {
  // check the home pages renders
  let tree!: ReactTestRenderer;
  await renderer.act(() => {
    tree = renderer.create(<App />);
  });
  tree.root.findByType(Home);
  tree.unmount();
});

it('App registers location service and logs to db with distance calculated', async () => {
  let tree!: ReactTestRenderer;
  await renderer.act(() => {
    tree = renderer.create(<App />);
  });
  tree.root.findByType(Home);
  const newLocation = {
    timestamp: new Date().getUTCMilliseconds(),
    mocked: true,
    coords: {
      accuracy: 110,
      latitude: 10.5,
      longitude: 150.1,
      heading: 10,
      speed: 5,
      altitude: 200,
      altitudeAccuracy: 0,
    },
  };

  // Trigger a location update.
  await renderer.act(() => {
    // @ts-ignore
    // this is a mock method
    Location._emitLocation(newLocation);
  });

  let record = await getOrCreateRealtimeRecord();
  expect(record.distance).toBe(0);
  expect(record.latitude).toBe(newLocation.coords.latitude);
  expect(record.longitude).toBe(newLocation.coords.longitude);

  const nextLocation = {
    timestamp: new Date().getUTCMilliseconds() + 1000,
    mocked: true,
    coords: {
      accuracy: 110,
      latitude: 22.5,
      longitude: 15.1,
      heading: 10,
      speed: 5,
      altitude: 400,
      altitudeAccuracy: 0,
    },
  };

  // Trigger a location update.
  await renderer.act(() => {
    // @ts-ignore
    // this is a mock method
    Location._emitLocation(nextLocation);
  });

  // change me.
  expect(record.distance).toBe(300);
  expect(record.latitude).toBe(nextLocation.coords.latitude);
  expect(record.longitude).toBe(nextLocation.coords.longitude);

  // Now check for record in realtime db.
  tree.unmount();
});
