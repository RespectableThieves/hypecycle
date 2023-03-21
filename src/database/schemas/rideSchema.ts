import {tableSchema} from '@nozbe/watermelondb';

export const rideSchema = tableSchema({
  name: 'ride',
  columns: [
    {
      name: 'started_at',
      type: 'number',
    },
    {
      name: 'ended_at',
      type: 'number',
    },
    {
      name: 'is_paused',
      type: 'boolean',
    },
  ],
});
