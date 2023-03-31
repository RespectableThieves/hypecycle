import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';
import * as strava from '../lib/strava';

type AuthorizeInput = {
  code: string;
};

type StravaContext = {
  athlete: strava.Athlete | null;
  authorize: (arg0: AuthorizeInput) => Promise<void>;
  logout: () => Promise<void>;
};

export const StravaContext = createContext<StravaContext>({
  athlete: null,
  authorize: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const StravaProvider = ({
  children,
  stravaToken,
}: {
  children: ReactNode;
  stravaToken: strava.Token | null;
}) => {
  // current user is just StravaUser.athlete
  // but we store the full StravaUser in secureStore
  // so we have access to tokens here too.
  const [athlete, setAthlete] = useState<strava.Athlete | null>(
    stravaToken?.athlete || null,
  );

  // see: https://react.dev/reference/react/useCallback#skipping-re-rendering-of-components
  const authorize = useCallback(async (params: AuthorizeInput) => {
    const data = await strava.authorize(params);
    await strava.saveToken(data);
    setAthlete(data.athlete);
  }, []);

  const logout = useCallback(async () => {
    // clear storage
    await strava.deleteToken();
    setAthlete(null);
    return;
  }, []);

  return (
    <StravaContext.Provider value={{athlete, authorize, logout}}>
      {children}
    </StravaContext.Provider>
  );
};

export const useStrava = () => useContext(StravaContext);
