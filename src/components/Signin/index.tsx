import {ReactNode, useEffect, useState} from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import {Button, Text} from 'react-native-paper';
import {useStrava} from '../../lib/StravaContext';
import {STRAVA_CLIENT_ID} from '../../constants';
import Container from '../Container';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
  revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
};

export default function Signin({children}: {children: ReactNode}) {
  // This will render a signin screen if not signed in.
  // otherwise render children.
  const {athlete: currentUser, authorize: authorizeUser} = useStrava();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: STRAVA_CLIENT_ID,
      scopes: ['activity:write'],
      redirectUri: makeRedirectUri({
        native: 'hypecycle://signin',
      }),
    },
    discovery,
  );

  useEffect(() => {
    // If we get a response back from the browser
    // redirect we load the authcode and authorize
    // the user
    if (response?.type === 'success') {
      console.log('authorizing');
      authorizeUser({code: response.params.code})
        .then(() => {
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
      // @ts-ignore
      setError(response?.error?.message);
    }
  }, [response, authorizeUser]);

  if (currentUser) {
    return <>{children}</>;
  }

  return (
    <Container>
      <Text>Signin with Strava</Text>
      {error && <Text>{error}</Text>}
      <Button
        testID="signin-button"
        mode="contained"
        disabled={!request || loading}
        loading={!request || loading}
        onPress={() => {
          setLoading(true);
          promptAsync();
        }}>
        Signin
      </Button>
    </Container>
  );
}
