import {useState, useEffect, useRef} from 'react';
import {
  Accuracy,
  LocationCallback,
  LocationSubscription,
  watchPositionAsync,
} from 'expo-location';

const useLocation = (shouldTrack: boolean, callback: LocationCallback) => {
  const [error, setError] = useState<Error | null>(null);
  const subscriberRef = useRef<LocationSubscription | null>(null);

  useEffect(() => {
    console.log({shouldTrack});
    const startWatching = async () => {
      try {
        const newSubscriber = await watchPositionAsync(
          {
            accuracy: Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 10,
          },
          callback,
        );
        subscriberRef.current = newSubscriber;
      } catch (err) {
        setError(err as Error);
      }
    };

    if (shouldTrack) {
      startWatching();
    } else {
      subscriberRef.current?.remove();
      subscriberRef.current = null;
    }

    return () => {
      if (subscriberRef.current) {
        subscriberRef.current.remove();
      }
    };
  }, [shouldTrack, callback]);

  return [error];
};

export default useLocation;
