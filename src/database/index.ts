import {Database} from '@nozbe/watermelondb';
import adapter from './adapter';
import SensorModel from './model/sensorModel';
import RealtimeDataModel from './model/realtimeDataModel';

export const dataBase = new Database({
  adapter,
  modelClasses: [SensorModel, RealtimeDataModel],
});
