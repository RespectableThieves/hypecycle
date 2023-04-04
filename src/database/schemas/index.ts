import {appSchema} from '@nozbe/watermelondb';
import {sensorSchema} from './sensorsSchema';
import {realtimeDataSchema} from './realtimeDataSchema';
import {rideSchema} from './rideSchema';
import {rideSummarySchema} from './rideSummarySchema';
import {historySchema} from './historySchema';

export const schemas = appSchema({
  version: 4,
  tables: [
    sensorSchema,
    realtimeDataSchema,
    rideSchema,
    rideSummarySchema,
    historySchema,
  ],
});
