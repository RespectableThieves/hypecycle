import MapWidget from './';
import renderer, {ReactTestRenderer} from 'react-test-renderer';

jest.mock('@react-navigation/elements', () => ({
  useHeaderHeight: jest.fn().mockImplementation(() => 200),
}));

it('map can render renders correctly', async () => {
  // not much to test on this.
  let tree!: ReactTestRenderer;
  await renderer.act(() => {
    tree = renderer.create(<MapWidget />);
  });
  tree.root.findByType(MapWidget);
  tree.unmount();
});
