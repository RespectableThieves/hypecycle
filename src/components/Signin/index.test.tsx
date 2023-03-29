import Signin from './';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
import {Text, Button} from 'react-native-paper';
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
        <Signin children={<Text>Home</Text>} />
      </StravaProvider>,
    );
  });

  const button = tree.root.findByType(Button);
  expect(strava.authorize).toHaveBeenCalledTimes(0);

  await renderer.act(async () => {
    await button.props.onPress();
  });

  expect(strava.authorize).toHaveBeenCalledTimes(1);
  expect(strava.authorize).toHaveBeenCalledWith({code: '123'});

  const text = tree.root.findByType(Text);
  expect(text.props.children).toBe('Home');

  tree.unmount();
});
