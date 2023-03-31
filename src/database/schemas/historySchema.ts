import { tableSchema } from '@nozbe/watermelondb';

export const historySchema = tableSchema({
  name: 'history',
  columns: [
    {
      name: 'distance',
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
      name: 'created_at',
      type: 'number',
    },
    {
      name: 'ride_id',
      type: 'string',
      isOptional: true
    }
  ],
});
