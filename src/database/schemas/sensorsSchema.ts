import { tableSchema } from '@nozbe/watermelondb';

export const sensorSchema = tableSchema({
  name: 'sensor',
  columns: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'address',
      type: 'string',
    },
    {
      name: 'is_primary',
      type: 'boolean',
    },
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'sensorType',
      type: 'string',
    },
    {
      name: 'created_at',
      type: 'number',
    },
  ],
});
