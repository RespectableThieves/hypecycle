import {useEffect, useState} from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import {Button, Text} from 'react-native-paper';
import {useStrava} from '../../lib/StravaContext';
import {STRAVA_CLIENT_ID} from '../../constants';
import {View} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
  revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
};

export default function StravaConnect() {
  // This will render a signin screen if not signed in.
  // otherwise render children.
  console.log(process.env.APP_VARIANT)
  const {athlete, authorize, logout} = useStrava();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [_, response, promptAsync] = useAuthRequest(
    {
      clientId: STRAVA_CLIENT_ID,
      scopes: ['activity:write'],
      redirectUri: makeRedirectUri({
        native: `hypecycle.${process.env.APP_VARIANT ? process.env.APP_VARIANT : 'development'}://settings`,
      }),
    },
    discovery,
  );

  useEffect(() => {
    // If we get a response back from the browser
    // redirect we load the authcode and authorize
    // the user
    if (loading && response?.type === 'success') {
      authorize({code: response.params.code})
        .then(() => {
          setError('');
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      // @ts-ignore
      setError(response?.error?.message);
    }
  }, [response, authorize, loading]);

  if (athlete) {
    return (
      <View>
        <Text>{error}</Text>
        <Button
          testID="strava-disconnect-button"
          mode="contained-tonal"
          onPress={async () => {
            await logout();
            console.log('Logged out');
          }}>
          Disconnect Strava
        </Button>
      </View>
    );
  }

  // Not connected with strava
  return (
    <View>
      <Text>{error}</Text>
      <Button
        testID="strava-connect-button"
        mode="contained"
        disabled={loading}
        loading={loading}
        onPress={() => {
          setLoading(true);
          promptAsync();
        }}>
        Connect Strava
      </Button>
    </View>
  );
}
