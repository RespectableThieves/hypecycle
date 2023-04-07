// cred https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import React, { useEffect, useRef } from 'react';

export default function useInterval(callback: any, delay: number, deps: any[]) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    async function tick() {
      await savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, ...deps]);
}
