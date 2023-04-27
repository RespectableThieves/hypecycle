import {LocationObject} from 'expo-location';
import {RealtimeDataModel} from '../../database';

export function accumulateMovingTime(
  lastRealTimeRecord: RealtimeDataModel,
  currentLocation: LocationObject,
): number {
  // If we don't have a speed we return the previous
  // if we have stopped we return the previous value
  if (
    currentLocation.coords.speed === null ||
    currentLocation.coords.speed < 1 ||
    !lastRealTimeRecord.lastLocationAt
  ) {
    return lastRealTimeRecord.movingTime;
  }

  // we are moving and have speed.
  // we should increment the movingTime
  const diff = currentLocation.timestamp - lastRealTimeRecord.lastLocationAt;

  return lastRealTimeRecord.movingTime + diff;
}
