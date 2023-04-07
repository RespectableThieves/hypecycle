import * as React from 'react';
import {FAB, Snackbar, Portal} from 'react-native-paper';
import {db, Q, RideModel} from '../../database';
import withObservables from '@nozbe/with-observables';
import {
  unpauseRide,
  pauseRide,
  stopRide,
  startRide,
  onRideEnd,
} from '../../lib/ride';

type Props = {
  activeRides: RideModel[];
};

type State = {
  open: boolean;
};

const RideFab = ({activeRides = []}: Props) => {
  // will only ever be one.
  const [activeRide] = activeRides;
  const [state, setState] = React.useState({open: false});
  const [message, setMessage] = React.useState('');

  const onStateChange = ({open}: State) => setState({open});
  const onDismissSnackBar = () => setMessage('');

  const {open} = state;

  const actions = [];
  if (activeRide) {
    // ride in progress
    actions.push({
      icon: 'stop',
      label: 'End ride',
      onPress: async () => {
        console.log('ride stop');
        await stopRide(activeRide);
        try {
          await onRideEnd(activeRide);
          setMessage('Successfully uploaded ride');
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.log(err.message);
            setMessage(err.message);
          } else {
            console.log('An unexpected error occurred:', err);
            setMessage('An unexpected error occurred');
          }
        }
      },
    });

    // is ride paused
    if (activeRide.isPaused) {
      actions.push({
        icon: 'play',
        label: 'Continue ride',
        onPress: async () => {
          console.log('ride unpause');
          await unpauseRide(activeRide);
        },
      });
    } else {
      actions.push({
        icon: 'pause',
        label: 'Pause ride',
        onPress: async () => {
          console.log('ride pause');
          await pauseRide(activeRide);
        },
      });
    }
  } else {
    // no active ride
    actions.push({
      icon: 'play',
      label: 'Start ride',
      onPress: async () => {
        console.log('ride start');
        await startRide();
      },
    });
  }

  return (
    <Portal>
      <FAB.Group
        visible
        open={open}
        testID="ride-fab-group"
        icon={open ? 'minus' : 'plus'}
        actions={actions}
        onStateChange={onStateChange}
      />
      <Snackbar visible={!!message} onDismiss={onDismissSnackBar}>
        {message}
      </Snackbar>
    </Portal>
  );
};

const enhance = withObservables([], () => ({
  activeRides: db
    .get<RideModel>('ride')
    .query(Q.where('ended_at', null))
    // NOTE: use need to explicitly set observe
    // the columns which may be updated if you are observing
    // a collection. See: https://watermelondb.dev/Query.html#advanced-observing
    .observeWithColumns(['ended_at', 'is_paused']),
}));

export default enhance(RideFab);
