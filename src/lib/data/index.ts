import {saveTCX, generateTCX} from './history';
import {getRideAggregates, RideAggregate} from './aggregates';
import {
  updateRealTimeRecord,
  onLocation,
  snapshotWorker,
  getOrCreateRealtimeRecord,
  onSnapshotEvent,
  updateRealTimeRecordRandom,
  simulateRealtimeDataWorker,
} from './realtime';
import {metersToKilometers} from './distance';
import {hrService, powerService} from './bluetooth';

export type {RideAggregate};

export {
  generateTCX,
  saveTCX,
  getOrCreateRealtimeRecord,
  updateRealTimeRecord,
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
