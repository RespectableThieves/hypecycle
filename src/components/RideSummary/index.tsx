import * as Linking from 'expo-linking';
import {useState} from 'react';
import {RideSummaryModel, db} from '../../database';
import withObservables from '@nozbe/with-observables';
import {Snackbar, Dialog, Portal, Card, Text, Button} from 'react-native-paper';
import MapRoute from '../MapRoute';
import {View, StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RideHistoryStack} from '../../navigators/RideHistoryStack';
import {rideUpload, StravaNotConnected} from '../../lib/ride';
import {useNavigation} from '@react-navigation/native';
import * as Strava from '../../lib/strava';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: -5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

function RideSummary({summary}: {summary: RideSummaryModel}) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const dismissDialog = () => setError('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={!!error} onDismiss={dismissDialog}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{error}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={dismissDialog}>Dismiss</Button>
            <Button
              onPress={() => {
                dismissDialog();
                // todo properly type root navigator
                // @ts-ignore
                navigation.navigate('Settings');
              }}>
              Authenticate
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Snackbar
          visible={!!message}
          onDismiss={() => {
            setMessage('');
          }}>
          {message}
        </Snackbar>
      </Portal>

      <MapRoute rideId={summary.ride.id} />
      <Card style={styles.card}>
        <Card.Title
          title={summary.ride.id}
          subtitle={summary.createdAt.toString()}
        />
        <Card.Content>
          <Text>stats goes here.</Text>
        </Card.Content>
        <Card.Actions>
          {!summary.stravaId ? (
            <Button
              onPress={async () => {
                try {
                  await rideUpload(summary);
                  setMessage('Successfully uploaded to strava');
                } catch (err) {
                  if (err instanceof StravaNotConnected) {
                    setError(
                      'You need to authenticate with strava before uploading a ride.',
                    );
                  }
                }
              }}>
              upload
            </Button>
          ) : (
            <Button
              onPress={async () => {
                const token = await Strava.loadToken();
                if (!token) {
                  setError(
                    'You need to authenticate with strava before uploading a ride.',
                  );
                  return;
                }
                const upload = await Strava.getUpload(summary.stravaId!, token);

                if (!upload.activity_id) {
                  setError('Strava status: ' + upload.status);
                } else {
                  Linking.openURL(
                    `https://www.strava.com/activities/${upload.activity_id}`,
                  );
                }
              }}>
              view
            </Button>
          )}
        </Card.Actions>
      </Card>
    </View>
  );
}

const enhance = withObservables(
  [],
  ({route}: {route: RouteProp<RideHistoryStack, 'Summary'>}) => {
    const {summaryId} = route.params;
    return {
      summary: db
        .get<RideSummaryModel>('ride_summary')
        .findAndObserve(summaryId),
    };
  },
);

export default enhance(RideSummary);
