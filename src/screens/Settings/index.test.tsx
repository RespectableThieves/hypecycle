import Settings from './';
import renderer, {
  ReactTestRenderer,
  ReactTestInstance,
} from 'react-test-renderer';
import App from '../../../App';
import {navigate} from '../../lib/navigation';
import * as strava from '../../lib/strava';

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
    navigate('Settings');
  });

  screen = tree.root.findByType(Settings);
});

afterEach(() => {
  tree.unmount();
});

it('Setting page renders current user details', async () => {
  const stravaToken = await strava.loadToken();

  // find the text with user name
  const text = screen.findByProps({testID: 'settings-user-greeting'});
  expect(text.props.children).toEqual(['Hi ', stravaToken?.athlete.firstname]);
});
