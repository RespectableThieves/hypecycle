import {appSchema} from '@nozbe/watermelondb';
import {sensorSchema} from './sensorsSchema';
import {realtimeDataSchema} from './realtimeDataSchema';

export const schemas = appSchema({
  version: 5,
  tables: [sensorSchema, realtimeDataSchema],
});
