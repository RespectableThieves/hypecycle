import ActiveRideView from './';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
import {updateRealTimeRecord, getOrCreateRealtimeRecord} from '../../utils';
import RealtimeDataModel from '../../database/model/realtimeDataModel';

// mocking call because we aren't rendering
// under a navigation context.
jest.mock('@react-navigation/elements', () => ({
  useHeaderHeight: jest.fn().mockImplementation(() => 200),
}));

it('Widget page renders & updates correctly', async () => {
  // write the first realtime row.
  const powerProps = {
    title: 'Power ',
    icon: 'lightning-bolt',
  };

  let tree!: ReactTestRenderer;

  let record = await getOrCreateRealtimeRecord();
  let updatedRecord!: RealtimeDataModel;

  // render the widget screen
  await renderer.act(async () => {
    tree = renderer.create(<ActiveRideView />);
  });

  // Check the widget is using the realtime table.
  // initial value should be 0
  const widget = tree.root.findByProps({...powerProps, data: 0});
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

  tree.unmount();
});
