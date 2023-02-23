import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";

export default class SkillModel extends Model {
  static table = "skills";

  @field("name") name!: string;
  @field("type") type!: string;
  @date("created_at") createdAt!: number;
}
