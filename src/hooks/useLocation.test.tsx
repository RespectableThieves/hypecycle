import * as Location from 'expo-location';
import renderer, {ReactTestRenderer} from 'react-test-renderer';
import {Text} from 'react-native';
import {LocationCallback} from 'expo-location';

import useLocation from './useLocation';

const watchPositionAsyncMock = jest.spyOn(Location, 'watchPositionAsync');

const TestComponent = ({
  shouldTrack,
  handleLocationUpdate,
}: {
  shouldTrack: boolean;
  handleLocationUpdate: LocationCallback;
}) => {
  // Test component used for renderering the hook
  const [locationError] = useLocation(shouldTrack, handleLocationUpdate);

  return <Text>{locationError?.message}</Text>;
};

describe('useLocation hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start watching location when shouldTrack is true', async () => {
    const callback = jest.fn();
    const removeMock = jest.fn();
    const shouldTrack = true;
    watchPositionAsyncMock.mockResolvedValue({remove: removeMock});

    await renderer.act(async () => {
      renderer.create(
        <TestComponent
          shouldTrack={shouldTrack}
          handleLocationUpdate={callback}
        />,
      );
    });

    expect(watchPositionAsyncMock).toHaveBeenCalled();
  });

  it('should stop watching location when shouldTrack is false', async () => {
    const callback = jest.fn();
    const removeMock = jest.fn();
    const shouldTrack = true;
    let tree!: ReactTestRenderer;

    watchPositionAsyncMock.mockImplementation(async () => {
      return {remove: removeMock};
    });

    await renderer.act(async () => {
      tree = renderer.create(
        <TestComponent
          shouldTrack={shouldTrack}
          handleLocationUpdate={callback}
        />,
      );
    });

    expect(watchPositionAsyncMock).toHaveBeenCalled();

    await renderer.act(async () => {
      tree.update(
        <TestComponent shouldTrack={false} handleLocationUpdate={callback} />,
      );
    });

    expect(removeMock).toHaveBeenCalled();
  });

  it('should set error when watchPositionAsync throws an error', async () => {
    const callback = jest.fn();
    const errorMessage = 'Location permission denied';
    const shouldTrack = true;
    let tree!: ReactTestRenderer;

    watchPositionAsyncMock.mockRejectedValue(new Error(errorMessage));

    await renderer.act(async () => {
      tree = renderer.create(
        <TestComponent
          shouldTrack={shouldTrack}
          handleLocationUpdate={callback}
        />,
      );
    });

    tree.root.findByProps({children: errorMessage});
  });
});
