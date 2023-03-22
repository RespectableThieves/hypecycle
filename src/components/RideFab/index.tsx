import * as React from 'react';
import {FAB, Portal} from 'react-native-paper';
import {dataBase} from '../../database';
import withObservables from '@nozbe/with-observables';
import RideModel from '../../database/model/ride';
import {Q} from '@nozbe/watermelondb';
import {unpauseRide, pauseRide, stopRide, startRide} from '../../lib/ride';

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

  const onStateChange = ({open}: State) => setState({open});

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
        open={open}
        testID="ride-fab-group"
        visible
        icon={open ? 'minus' : 'plus'}
        actions={actions}
        onStateChange={onStateChange}
      />
    </Portal>
  );
};

const enhance = withObservables([], () => ({
  activeRides: dataBase
    .get<RideModel>('ride')
    .query(Q.where('ended_at', null))
    // NOTE: use need to explicitly set observe
    // the columns which may be updated if you are observing
    // a collection. See: https://watermelondb.dev/Query.html#advanced-observing
    .observeWithColumns(['ended_at', 'is_paused']),
}));

export default enhance(RideFab);
