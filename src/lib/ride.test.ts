import {rideService, stopRide, startRide} from './ride';
import {getOrCreateRealtimeRecord} from './realtimeData';

describe('ride and realtime db interactions', () => {
  it('should write to realtime_data.ride_id on stop start', async () => {
    let realtimeData = await getOrCreateRealtimeRecord();
    expect(realtimeData.ride?.id).toBeNull();
    const ride = await startRide();
    expect(realtimeData.ride?.id).toBeTruthy();
    await stopRide(ride);
    expect(realtimeData.ride?.id).toBeNull();
  });
});

describe('ride service', () => {
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

  it('should handle inprogress journeys when starting', async () => {
    const mockCallback = jest.fn();
    const ride = await startRide();
    const unsubscribe = await rideService(mockCallback, 1000);
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
    unsubscribe();
  });
});
