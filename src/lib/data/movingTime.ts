import { LocationObject } from 'expo-location';
import { RealtimeDataModel } from '../../database';

export function accumulateMovingTime(
  lastRealTimeRecord: RealtimeDataModel,
  currentLocation: LocationObject,
): number {
  // If we don't have a speed we return the previous
  // if we have stopped we return the previous value
  if (
    currentLocation.coords.speed === null ||
    currentLocation.coords.speed === 0
  ) {
    return lastRealTimeRecord.movingTime;
  }

  // we are moving and have speed.
  // we should increment the movingTime
  const diff = Date.now() - lastRealTimeRecord.createdAt;

  return lastRealTimeRecord.movingTime + diff;
}
