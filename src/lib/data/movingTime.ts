import {LocationObject} from 'expo-location';
import {RealtimeDataModel} from '../../database';
import constants from '../../constants';

export function accumulateMovingTime(
  lastRealTimeRecord: RealtimeDataModel,
  currentLocation: LocationObject,
): number {
  // If we don't have a speed we return the previous
  // if we have stopped we return the previous value
  if (
    currentLocation.coords.speed === null ||
    currentLocation.coords.speed < constants.movingSpeed ||
    !lastRealTimeRecord.lastLocationAt
  ) {
    return lastRealTimeRecord.movingTime;
  }

  // we are moving and have speed.
  // we should increment the movingTime
  const diff =
    currentLocation.timestamp - lastRealTimeRecord.lastLocationAt.getTime();

  return lastRealTimeRecord.movingTime + diff;
}
