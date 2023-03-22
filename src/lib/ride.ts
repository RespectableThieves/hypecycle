import RideModel from '../database/model/ride';
import {dataBase} from '../database';

export function startRide() {
  // TODO stop any current rides.
  return dataBase.write(async () => {
    return dataBase.get<RideModel>('ride').create(r => {
      r.startedAt = new Date().getUTCMilliseconds();
      return r;
    });
  });
}

export function stopRide(ride: RideModel) {
  return dataBase.write(async () => {
    return ride.update(() => {
      ride.endedAt = new Date().getUTCMilliseconds();
      return ride;
    });
  });
}

export function pauseRide(ride: RideModel) {
  return dataBase.write(async () => {
    return ride.update(() => {
      ride.isPaused = true;
      return ride;
    });
  });
}

export function unpauseRide(ride: RideModel) {
  return dataBase.write(async () => {
    return ride.update(() => {
      ride.isPaused = false;
      return ride;
    });
  });
}
