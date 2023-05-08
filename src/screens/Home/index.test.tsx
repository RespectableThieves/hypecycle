import ActiveRideView from './';
import renderer, {
  ReactTestRenderer,
  ReactTestInstance,
} from 'react-test-renderer';
import { updateRealTimeRecord, getOrCreateRealtimeRecord } from '../../lib/data';
import App from '../../../App';
import RealtimeDataModel from '../../database/model/realtimeDataModel';
import { navigate } from '../../lib/navigation';
import RideSummary from '../../components/RideSummary'
import MapRoute from '../../components/MapRoute'

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
    navigate('Active Ride');
  });

  screen = tree.root.findByType(ActiveRideView);
});

afterEach(() => {
  tree.unmount();
});

it('Widget page renders & updates correctly', async () => {
  // write the first realtime row.
  const powerProps = {
    title: 'Power ',
    icon: 'lightning-bolt',
  };

  let record = await getOrCreateRealtimeRecord();
  let updatedRecord!: RealtimeDataModel;

  // Check the widget is using the realtime table.
  // initial value should be 0
  const widget = screen.findByProps({ ...powerProps, data: null });
  expect(widget).toBeTruthy();

  // write to the db updating the realtime table.
  await renderer.act(async () => {
    updatedRecord = await updateRealTimeRecord(record);
  });

  // again check the component to see that it's re-rendered correctly
  const updatedWidget = tree.root.findByProps({
    ...powerProps,
    data: updatedRecord.instantPower,
  });
  expect(updatedWidget).toBeTruthy();
});

it('Can start/pause/unpause and stop a ride', async () => {
  const labels = {
    pause: 'Pause ride',
    start: 'Start ride',
    end: 'End ride',
    unpause: 'Continue ride',
  };
  const rideFabGroup = tree.root.findByProps({ testID: 'ride-fab-group' });

  const getActionLabels = () => {
    return rideFabGroup.props.actions.map((a: any) => a.label);
  };

  const findActionLabel = (label: string) => {
    return rideFabGroup.props.actions.find((a: any) => a.label === label);
  };

  // only option should be Start ride
  expect(getActionLabels()).toEqual([labels.start]);

  // now lets start a ride t
  await renderer.act(async () => {
    await findActionLabel(labels.start).onPress();
  });

  // now lets check our options
  expect(getActionLabels()).toEqual([labels.end, labels.pause]);

  // now let's pause the ride
  await renderer.act(async () => {
    await findActionLabel(labels.pause).onPress();
  });

  // now lets check our options
  expect(getActionLabels()).toEqual([labels.end, labels.unpause]);


  const realtimeData = await getOrCreateRealtimeRecord();
  const rideId = realtimeData!.ride!.id
  expect(rideId).toBeTruthy()

  // now let's unpause the ride
  await renderer.act(async () => {
    await findActionLabel(labels.unpause).onPress();
  });

  // now lets check our options
  expect(getActionLabels()).toEqual([labels.end, labels.pause]);

  // now let's stop the ride
  await renderer.act(async () => {
    await findActionLabel(labels.end).onPress();
  });

  // check we can only see the start option again.
  expect(getActionLabels()).toEqual([labels.start]);

  // Check we have rendered the ride Summary
  // and the map
  tree.root.findByType(RideSummary);
  const map = tree.root.findByType(MapRoute)
  expect(map.props.rideId).toBe(rideId)
});
