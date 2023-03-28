import Signin from './';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
import {Text} from 'react-native-paper';
import {StravaProvider} from '../../lib/StravaContext';
import * as strava from '../../lib/strava';
import {dummyStravaToken} from '../../../setupHooks';

it('Should only call authorize once when logging in.', async () => {
  jest.spyOn(strava, 'authorize').mockResolvedValueOnce(dummyStravaToken);
  // check the home pages renders
  let tree!: ReactTestRenderer;
  await renderer.act(() => {
    tree = renderer.create(
      <StravaProvider stravaToken={null}>
        <Signin children={<Text>Home</Text>} />
      </StravaProvider>,
    );
  });

  expect(strava.authorize).toHaveBeenCalledTimes(1);
  expect(strava.authorize).toHaveBeenCalledWith({code: '123'});
  const text = tree.root.findByType(Text);
  expect(text.props.children).toBe('Home');

  tree.unmount();
});
