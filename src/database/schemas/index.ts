import { appSchema } from "@nozbe/watermelondb";
import { sensorSchema } from "./sensorsSchema";
import { skillSchema } from "./skillSchema";

export const schemas = appSchema({
  version: 2,
  tables: [skillSchema, sensorSchema],
});
