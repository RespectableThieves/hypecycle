import { saveTCX, generateTCX, historyToGeoJSON } from './history';

import { getRideAggregates, RideAggregate } from './aggregates';
import {
  onLocation,
  snapshotWorker,
  getOrCreateRealtimeRecord,
  onSnapshotEvent,
  updateRealTimeRecordRandom,
  simulateRealtimeDataWorker,
} from './realtime';
import { metersToKilometers } from './distance';
import { hrService, powerService } from './bluetooth';

export type { RideAggregate };

export {
  generateTCX,
  saveTCX,
  historyToGeoJSON,
  getOrCreateRealtimeRecord,
  onLocation,
  snapshotWorker,
  metersToKilometers,
  getRideAggregates,
  onSnapshotEvent,
  updateRealTimeRecordRandom,
  simulateRealtimeDataWorker,
  hrService,
  powerService,
};
