import { useState, useEffect } from 'react';
import {
  Accuracy,
  LocationCallback,
  LocationSubscription,
  watchPositionAsync
} from 'expo-location';

export default (shouldTrack: boolean, callback: LocationCallback) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscriber: LocationSubscription;

    const startWatching = async () => {
      try {
        const subscriber = await watchPositionAsync(
          {
            accuracy: Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 10
          },
          callback
        );

      } catch (err) {
        setError(err);
      }
    };

    if (shouldTrack) {
      startWatching();
    } else {
      subscriber?.remove();
      subscriber = null;
    }

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, [shouldTrack, callback]);

  return [error];
};