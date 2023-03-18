import { Database } from '@nozbe/watermelondb';
// import SQLiteAdapters from '@nozbe/watermelondb/adapters/sqlite';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'


import { schemas } from './schemas';
import SensorModel from './model/sensorModel';

// const adapter = new LokiJSAdapter({
//   schema: schemas,
//   useWebWorker: false,
//   useIncrementalIndexedDB: false,
// });
const adapter = new LokiJSAdapter({
  schema: schemas,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  extraLokiOptions: {
    autosave: false
  }
});

export const dataBase = new Database({
  adapter,
  modelClasses: [SensorModel],
});
