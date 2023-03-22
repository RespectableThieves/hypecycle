import {appSchema} from '@nozbe/watermelondb';
import {sensorSchema} from './sensorsSchema';
import {realtimeDataSchema} from './realtimeDataSchema';
import {rideSchema} from './rideSchema';
import {rideSummarySchema} from './rideSummarySchema';

export const schemas = appSchema({
  version: 1,
  tables: [sensorSchema, realtimeDataSchema, rideSchema, rideSummarySchema],
});
