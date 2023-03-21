import {tableSchema} from '@nozbe/watermelondb';

export const rideSummarySchema = tableSchema({
  name: 'rideSummary',
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
      name: 'avg_speed',
      type: 'number',
    },
    {
      name: 'avg_power',
      type: 'number',
    },
    {
      name: 'avg_cadence',
      type: 'number',
    },
    {
      name: 'max_speed',
      type: 'number',
    },
    {
      name: 'max_power',
      type: 'number',
    },
    {
      name: 'max_cadence',
      type: 'number',
    },
    {
      name: 'max_altitude',
      type: 'number',
    },
    {
      name: 'max_hr',
      type: 'number',
    },
    {
      name: 'min_hr',
      type: 'number',
    },
    {
      name: 'accumulated_accent',
      type: 'number',
    },
    {
      name: 'accumulated_deccent',
      type: 'number',
    },
  ],
});
