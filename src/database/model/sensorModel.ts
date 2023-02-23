import { Model } from "@nozbe/watermelondb";
import { field, date, json } from "@nozbe/watermelondb/decorators";

const sanitizeServices = (rawServices: any[]) => {
    return Array.isArray(rawServices) ? rawServices.map(String) : []
}

export default class SensorModel extends Model {
  static table = "sensors";

  @field("name") name!: string;
  @field("address") address!: string;
  @field("type") type!: string;
  @json('services', sanitizeServices) services: any
  @date("created_at") createdAt!: number;
}
  
