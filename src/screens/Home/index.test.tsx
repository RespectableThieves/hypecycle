import ActiveRideView from './';
import renderer from 'react-test-renderer';

// mocking call because we aren't rendering
// under a navigation context.
jest.mock('@react-navigation/elements', () => ({
  useHeaderHeight: jest.fn().mockImplementation(() => 200),
}));

it('Widget page renders & updates correctly', () => {
  // TODO:
  // 1. write to the realtime db table.
  // 2. render component
  // 3. check values
  // 4. write to db to update values
  // 5. Check component values again.
  const tree = renderer.create(<ActiveRideView />);

  const widget = tree.root.findByProps({
    title: 'Power ',
    data: 301,
    icon: 'lightning-bolt',
  });
  expect(widget.props).toBeTruthy();

  tree.unmount();
});
