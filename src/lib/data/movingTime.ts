import {LocationObject} from 'expo-location';
import {RealtimeDataModel} from '../../database';
import constants from '../../constants';

export async function accumulateMovingTime(
  lastRealTimeRecord: RealtimeDataModel,
  currentLocation: LocationObject,
): Promise<number> {
  // If we don't have a speed we return the previous
  // if we have stopped we return the previous value
  if (
    currentLocation.coords.speed === null ||
    currentLocation.coords.speed < constants.movingSpeed ||
    !lastRealTimeRecord.lastLocationAt
  ) {
    // we need to ensure that the
    return lastRealTimeRecord.movingTime;
  }

  const ride = await lastRealTimeRecord.ride?.fetch();

  if (ride && lastRealTimeRecord.lastLocationAt < ride?.startedAt) {
    // check if we have a ride but this is the first location
    return currentLocation.timestamp - ride.startedAt.getTime();
  }

  // we are moving and have speed.
  // we should increment the movingTime
  const diff =
    currentLocation.timestamp - lastRealTimeRecord.lastLocationAt.getTime();

  return lastRealTimeRecord.movingTime + diff;
}
