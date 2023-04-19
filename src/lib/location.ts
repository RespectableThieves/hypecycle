import {
  Accuracy,
  LocationCallback,
  LocationSubscription,
  watchPositionAsync,
} from 'expo-location';

import {onLocation} from './data';

export function locationService(callback: LocationCallback) {
  let subscription: LocationSubscription;

  const start = async () => {
    subscription = await watchPositionAsync(
      {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      callback,
    );
  };

  const stop = () => {
    if (subscription) {
      subscription.remove();
    }
  };

  return {
    start,
    stop,
  };
}

export const locationWorker = locationService(onLocation);
