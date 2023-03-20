import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import {schemas} from '../schemas';

const adapter = new LokiJSAdapter({
  schema: schemas,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  extraLokiOptions: {
    autosave: false,
  },
});

export default adapter;
