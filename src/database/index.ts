import {Database} from '@nozbe/watermelondb';
import adapter from './adapter';
import SensorModel from './model/sensorModel';

export const dataBase = new Database({
  adapter,
  modelClasses: [SensorModel],
});
