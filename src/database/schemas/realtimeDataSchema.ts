import {tableSchema} from '@nozbe/watermelondb';

export const realtimeDataSchema = tableSchema({
  name: 'realtime_data',
  columns: [
    {
      name: 'distance',
      type: 'number',
    },
    {
      name: 'elapsed_time',
      type: 'number',
    },
    {
      name: 'speed',
      type: 'number',
    },
    {
      name: 'latitude',
      type: 'number',
    },
    {
      name: 'longitude',
      type: 'number',
    },
    {
      name: 'altitude',
      type: 'number',
    },
    {
      name: 'heading',
      type: 'number',
    },
    {
      name: 'heart_rate',
      type: 'number',
    },
    {
      name: 'instant_power',
      type: 'number',
    },
    {
      name: 'three_sec_power',
      type: 'number',
    },
    {
      name: 'ten_sec_power',
      type: 'number',
    },
    {
      name: 'cadence',
      type: 'number',
    },
    {
      name: 'is_bluetooth',
      type: 'boolean',
    },
    {
      name: 'is_wifi',
      type: 'boolean',
    },
    {
      name: 'is_power',
      type: 'boolean',
    },
    {
      name: 'is_heart_rate',
      type: 'boolean',
    },
    {
      name: 'is_cadence',
      type: 'boolean',
    },
    {
      name: 'created_at',
      type: 'number',
    },
  ],
});
