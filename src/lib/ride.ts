import {db, RideModel} from '../database';

export function startRide() {
  // TODO stop any current rides.
  return db.write(async () => {
    return db.get<RideModel>('ride').create(r => {
      r.startedAt = new Date().getUTCMilliseconds();
      return r;
    });
  });
}

export function stopRide(ride: RideModel) {
  return db.write(async () => {
    return ride.update(() => {
      ride.endedAt = new Date().getUTCMilliseconds();
      ride.isPaused = false;
      return ride;
    });
  });
}

export function pauseRide(ride: RideModel) {
  return db.write(async () => {
    return ride.update(() => {
      ride.isPaused = true;
      return ride;
    });
  });
}

export function unpauseRide(ride: RideModel) {
  return db.write(async () => {
    return ride.update(() => {
      ride.isPaused = false;
      return ride;
    });
  });
}
