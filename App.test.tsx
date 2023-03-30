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

it('App registers location service and logs to db', async () => {
  // check the home pages renders
  let tree!: ReactTestRenderer;
  await renderer.act(() => {
    tree = renderer.create(<App />);
  });
  tree.root.findByType(Home);
  const newLocation = {
    timestamp: new Date().getUTCMinutes(),
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

  expect(record.latitude).toBe(newLocation.coords.latitude);
  expect(record.longitude).toBe(newLocation.coords.longitude);

  // Now check for record in realtime db.
  tree.unmount();
});
