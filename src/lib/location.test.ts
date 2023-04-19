import * as Location from 'expo-location';
import {locationService} from './location';

it('should call callback when new location is emitted is called', async () => {
  const callback = jest.fn();
  const service = locationService(callback);

  await service.start();
  const newLocation = {
    timestamp: new Date().getUTCMilliseconds(),
    mocked: true,
    coords: {
      accuracy: 110,
      latitude: 41.4027,
      longitude: 2.1743,
      heading: 10,
      speed: 5,
      altitude: 41.0,
      altitudeAccuracy: 0,
    },
  };

  // @ts-ignore
  // this is a mock method
  Location._emitLocation(newLocation);
  expect(callback).toHaveBeenCalledWith(newLocation);
  service.stop();
});
