import { Database } from "@nozbe/watermelondb";
import SQLiteAdapters from "@nozbe/watermelondb/adapters/sqlite";

import { schemas } from "./schemas";
import SkillModel from "./model/skillModel";
import SensorModel from "./model/sensorModel";

const adapter = new SQLiteAdapters({
  schema: schemas,
});

export const dataBase = new Database({
  adapter,
  modelClasses: [SkillModel, SensorModel],
});
