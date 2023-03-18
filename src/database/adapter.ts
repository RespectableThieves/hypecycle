import SQLiteAdapters from '@nozbe/watermelondb/adapters/sqlite';
import {schemas} from './schemas';

const adapter = new SQLiteAdapters({
  schema: schemas,
});

export default adapter;
