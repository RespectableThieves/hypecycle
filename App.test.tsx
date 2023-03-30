import App from './App';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
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
