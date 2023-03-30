import {rideService, stopRide, startRide} from './ride';

describe('snapshot service', () => {
  it('should start and watch for ride/start/stop events', async () => {
    const mockCallback = jest.fn();

    const unsubscribe = await rideService(mockCallback, 1000);
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
    // shouldnt' call anymore
    expect(mockCallback).toHaveBeenCalledTimes(3);
    unsubscribe();
  });
});
