import { generateTCX } from './history';
import { getRideAggregates, RideAggregate } from './aggregates';
import {
  updateRealTimeRecord,
  onLocation,
  snapshotWorker,
  getOrCreateRealtimeRecord,
} from './realtime';
import { metersToKilometers } from './distance';

export type { RideAggregate };

export {
  generateTCX,
  getOrCreateRealtimeRecord,
  updateRealTimeRecord,
  onLocation,
  snapshotWorker,
  metersToKilometers,
  getRideAggregates
};
