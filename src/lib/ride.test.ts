import { stopRide, startRide } from './ride';
import { getOrCreateRealtimeRecord } from './data';

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
