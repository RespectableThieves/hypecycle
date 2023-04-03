import {Database} from '@nozbe/watermelondb';
import adapter from './adapter';
import SensorModel from './model/sensorModel';
import RealtimeDataModel from './model/realtimeDataModel';
import RideModel from './model/ride';
import RideSummaryModel from './model/rideSummary';
import HistoryModel from './model/historyModel';
import {Q} from '@nozbe/watermelondb';

export const db = new Database({
  adapter,
  modelClasses: [
    SensorModel,
    RealtimeDataModel,
    RideModel,
    RideSummaryModel,
    HistoryModel,
  ],
});

export {
  SensorModel,
  RealtimeDataModel,
  RideModel,
  RideSummaryModel,
  HistoryModel,
  Q,
};
