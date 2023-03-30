import StravaConnect from './';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
import {Button} from 'react-native-paper';
import {StravaProvider} from '../../lib/StravaContext';
import * as strava from '../../lib/strava';

it('Should only call authorize once when logging in.', async () => {
  const dummyStravaToken = await strava.authorize({code: '123'});
  jest.spyOn(strava, 'authorize').mockResolvedValueOnce(dummyStravaToken);
  // check the home pages renders
  let tree!: ReactTestRenderer;
  // @ts-ignore
  strava.authorize.mockClear();
  expect(strava.authorize).toHaveBeenCalledTimes(0);

  await renderer.act(() => {
    tree = renderer.create(
      <StravaProvider stravaToken={null}>
        <StravaConnect />
      </StravaProvider>,
    );
  });

  const connectButton = tree.root.findByType(Button);
  expect(strava.authorize).toHaveBeenCalledTimes(0);

  await renderer.act(async () => {
    await connectButton.props.onPress();
  });

  expect(strava.authorize).toHaveBeenCalledTimes(1);
  expect(strava.authorize).toHaveBeenCalledWith({code: '123'});

  const disconnectButton = tree.root.findByType(Button);
  expect(disconnectButton.props.children).toBe('Disconnect Strava');

  tree.unmount();
});
