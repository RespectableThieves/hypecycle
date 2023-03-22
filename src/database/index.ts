import {Database} from '@nozbe/watermelondb';
import adapter from './adapter';
import SensorModel from './model/sensorModel';
import RealtimeDataModel from './model/realtimeDataModel';
import Ride from './model/ride';
import RideSummary from './model/rideSummary';

export const dataBase = new Database({
  adapter,
  modelClasses: [SensorModel, RealtimeDataModel, Ride, RideSummary],
});
