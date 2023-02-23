import { appSchema } from "@nozbe/watermelondb";
import { sensorSchema } from "./sensorsSchema";

export const schemas = appSchema({
  version: 4,
  tables: [sensorSchema],
});
