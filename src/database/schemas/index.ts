import { appSchema } from "@nozbe/watermelondb";

import { skillSchema } from "./skillSchema";

export const schemas = appSchema({
  version: 1,
  tables: [skillSchema],
});
