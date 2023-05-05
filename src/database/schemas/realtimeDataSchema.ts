import {tableSchema} from '@nozbe/watermelondb';

export const realtimeDataSchema = tableSchema({
  name: 'realtime_data',
  columns: [
    {
      name: 'distance',
      type: 'number',
    },
    {
      name: 'moving_time',
      type: 'number',
    },
    {
      name: 'elapsed_time',
      type: 'number',
    },
    {
      name: 'speed',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'latitude',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'longitude',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'altitude',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'heading',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'heart_rate',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'instant_power',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'three_sec_power',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'ten_sec_power',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'cadence',
      type: 'number',
      isOptional: true,
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
    {
      name: 'last_location_at',
      type: 'number',
      isOptional: true,
    },
    {
      name: 'ride_id',
      type: 'string',
      isOptional: true,
    },
  ],
});
