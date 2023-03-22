import ActiveRideView from './';
import renderer, {
  ReactTestRenderer,
  ReactTestInstance,
} from 'react-test-renderer';
import {updateRealTimeRecord, getOrCreateRealtimeRecord} from '../../utils';
import App from '../../../App';
import RealtimeDataModel from '../../database/model/realtimeDataModel';
import {navigate} from '../../lib/navigation';

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
  const widget = screen.findByProps({...powerProps, data: 0});
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
