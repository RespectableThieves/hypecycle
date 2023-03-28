import App from './App';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
import {SECURE_STORE_CURRENT_USER_KEY} from './src/constants';
import * as SecureStore from 'expo-secure-store';
import Home from './src/screens/Home';

it('App renders correctly for signed user.', async () => {
  // check the home pages renders
  let tree!: ReactTestRenderer;
  await renderer.act(() => {
    tree = renderer.create(<App />);
  });
  tree.root.findByType(Home);
  tree.unmount();
});

it('App renders correctly for unsigned in user.', async () => {
  // check the Signin component renders if no current user.
  SecureStore.deleteItemAsync(SECURE_STORE_CURRENT_USER_KEY);

  let tree!: ReactTestRenderer;
  await renderer.act(() => {
    tree = renderer.create(<App />);
  });
  tree.root.findByProps({testID: 'signin-button'});
  tree.unmount();
});
