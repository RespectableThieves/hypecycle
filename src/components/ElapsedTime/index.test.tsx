import ElapsedTime from './';
import {DataText} from '../SimpleMetric/styles';
import renderer, {ReactTestRenderer} from 'react-test-renderer';

// mocking call because we aren't rendering
// under a navigation context.
jest.mock('@react-navigation/elements', () => ({
  useHeaderHeight: jest.fn().mockImplementation(() => 200),
}));
jest.useFakeTimers();

it(
  'should increment timer on each render',
  async () => {
    let tree!: ReactTestRenderer;

    renderer.act(() => {
      tree = renderer.create(<ElapsedTime startedAt={undefined} />);
    });

    // should render -- for undefined
    const timer = tree.root.findByType(DataText);
    expect(timer.props.children).toBe('--');

    const startedAt = Date.now();

    renderer.act(() => {
      tree.update(<ElapsedTime startedAt={startedAt} />);
    });

    expect(timer.props.children).toBe('--');

    renderer.act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(timer.props.children).toBe('00:00:01');

    renderer.act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });

    expect(timer.props.children).toBe('00:01:01');

    renderer.act(() => {
      jest.advanceTimersByTime(60 * 60 * 1000);
    });

    expect(timer.props.children).toBe('01:01:01');
  },
  -1,
);
