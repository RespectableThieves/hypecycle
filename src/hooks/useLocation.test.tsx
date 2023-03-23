import {renderHook, act} from '@testing-library/react-hooks';
import * as Location from 'expo-location';
import useLocation from './useLocation';

// Mock the watchPositionAsync function
const watchPositionAsyncMock = jest.spyOn(Location, 'watchPositionAsync');

describe('useLocation hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start watching location when shouldTrack is true', async () => {
    const callback = jest.fn();
    const removeMock = jest.fn();
    watchPositionAsyncMock.mockResolvedValue({remove: removeMock});

    await act(async () => {
      renderHook(({shouldTrack}) => useLocation(shouldTrack, callback), {
        initialProps: {shouldTrack: true},
      });
    });

    expect(watchPositionAsyncMock).toHaveBeenCalled();
  });

  it('should stop watching location when shouldTrack is false', async () => {
    const callback = jest.fn();
    const removeMock = jest.fn();

    const promise = new Promise(resolve => {
      watchPositionAsyncMock.mockImplementation(async () => {
        resolve(null); // Resolve the promise when watchPositionAsync is called
        return {remove: removeMock};
      });
    });

    const {rerender} = renderHook(
      ({shouldTrack}) => useLocation(shouldTrack, callback),
      {
        initialProps: {shouldTrack: true},
      },
    );

    await act(() => promise as Promise<void>); // Wait for watchPositionAsync to be called

    expect(watchPositionAsyncMock).toHaveBeenCalled();

    await act(async () => {
      rerender({shouldTrack: false});
    });

    expect(removeMock).toHaveBeenCalled();
  });

  it('should set error when watchPositionAsync throws an error', async () => {
    const callback = jest.fn();
    const errorMessage = 'Location permission denied';
    watchPositionAsyncMock.mockRejectedValue(new Error(errorMessage));

    const {result, waitForNextUpdate} = renderHook(() =>
      useLocation(true, callback),
    );
    await waitForNextUpdate();

    const [error] = result.current as [Error | null];
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe(errorMessage);
  });
});
