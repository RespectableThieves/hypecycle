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

  screen.findByProps({testID: 'strava-disconnect-button'});
  expect(text.props.children).toEqual(['Hi ', stravaToken?.athlete.firstname]);
});

it('App renders correctly for unsigned in user.', async () => {
  // check the Signin component renders if no current user.
  const button = screen.findByProps({testID: 'strava-disconnect-button'});

  await renderer.act(async () => {
    await button.props.onPress();
  });

  screen.findByProps({testID: 'strava-connect-button'});
  tree.unmount();
});
