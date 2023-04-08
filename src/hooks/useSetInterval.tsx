// cred https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import {useEffect, useRef} from 'react';

export default function useInterval(
  callback: () => Promise<void>,
  delay: number | null,
) {
  const savedCallback = useRef<() => Promise<void>>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    async function tick() {
      await savedCallback.current?.();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
