import {startRide, stopRide} from '../ride';
import {snapshotService} from './realtime';

describe('snapshot service', () => {
  jest.useFakeTimers();

  it('should start and watch for ride/start/stop events', async () => {
    const mockCallback = jest.fn();
    const worker = snapshotService(mockCallback);
    await worker.start(1000);
    expect(mockCallback).not.toHaveBeenCalled();
    const ride = await startRide();
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // now the callback should be triggered
    jest.advanceTimersByTime(1001);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    // now stop the ride
    await stopRide(ride);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    jest.advanceTimersByTime(3000);
    const newRide = await startRide();
    expect(mockCallback).toHaveBeenCalledTimes(4);
    jest.advanceTimersByTime(1001);
    expect(mockCallback).toHaveBeenCalledTimes(5);
    await stopRide(newRide);
    expect(mockCallback).toHaveBeenCalledTimes(6);
    jest.advanceTimersByTime(1001);
    expect(mockCallback).toHaveBeenCalledTimes(6);
    worker.stop();
    jest.advanceTimersByTime(1001);
    expect(mockCallback).toHaveBeenCalledTimes(6);
    // note this test doesn't actually run for 10s
    // because we are using fake timers
  }, 10000);

  it('should handle inprogress rides when starting', async () => {
    const mockCallback = jest.fn();
    const ride = await startRide();
    const worker = snapshotService(mockCallback);
    await worker.start(1000);
    expect(mockCallback).not.toHaveBeenCalled();
    // now the callback should be triggered
    jest.advanceTimersByTime(1001);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // now stop the ride
    await stopRide(ride);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(3000);
    // shouldnt' call anymore
    expect(mockCallback).toHaveBeenCalledTimes(2);
    worker.stop();
  });
});
