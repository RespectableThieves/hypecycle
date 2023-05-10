import ActiveRideView from './';
import renderer, {
  ReactTestRenderer,
  ReactTestInstance,
} from 'react-test-renderer';
import App from '../../../App';
import {navigate} from '../../lib/navigation';
import {FlatList} from 'react-native';
import {startRide, stopRide, saveRideSummary} from '../../lib/ride';
import {
  updateRealTimeRecordRandom,
  getOrCreateRealtimeRecord,
  onSnapshotEvent,
} from '../../lib/data';
import {RideSummaryModel} from '../../database';

import {Card, List} from 'react-native-paper';

let tree!: ReactTestRenderer;
let screen!: ReactTestInstance;

beforeEach(async () => {
  // becuase this screen relies
  // on providers like globalData
  // navigation etc. We'll just load
  // the app then navigate to the screen.
  await renderer.act(async () => {
    tree = renderer.create(<App />);
  });

  renderer.act(() => {
    navigate('RideHistory');
  });

  screen = tree.root.findByType(ActiveRideView);
});

afterEach(() => {
  tree.unmount();
});

it('should render list of rides', async () => {
  // write the first realtime row.
  const ridelist = screen.findByType(FlatList);
  const summaries: RideSummaryModel[] = [];
  expect(ridelist.props.data).toEqual(summaries);
  const rideCount = 3;
  const snapshotCount = 5;
  await renderer.act(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _z in [...Array(rideCount).keys()]) {
      const ride = await startRide();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _x in [...Array(snapshotCount).keys()]) {
        const realtime = await getOrCreateRealtimeRecord();
        // jest.advanceTimersByTime(3000);
        await updateRealTimeRecordRandom(realtime);
        await onSnapshotEvent();
      }
      await stopRide(ride);
      const rideSummary = await saveRideSummary(ride);
      summaries.push(rideSummary);
    }
  });

  // check we are rendering correct number of items.
  expect(ridelist.props.data.length).toEqual(rideCount);
});

it('should be able to navigate to ride page', async () => {
  // write the first realtime row.
  const snapshotCount = 5;
  let rideSummary: RideSummaryModel;

  await renderer.act(async () => {
    const ride = await startRide();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _x in [...Array(snapshotCount).keys()]) {
      const realtime = await getOrCreateRealtimeRecord();
      // jest.advanceTimersByTime(3000);
      await updateRealTimeRecordRandom(realtime);
      await onSnapshotEvent();
    }
    await stopRide(ride);
    rideSummary = await saveRideSummary(ride);
  });

  const listItem = screen.findByType(List.Item);
  expect(listItem.props.title).toBe(rideSummary!.ride.id);

  // navigate to ride page
  await renderer.act(async () => {
    listItem.props.onPress();
  });

  const card = screen.findByType(Card.Title);
  expect(card.props.title).toBe(rideSummary!.ride.id);
});
