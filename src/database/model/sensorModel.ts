import {Model} from '@nozbe/watermelondb';
import {field, date, json, writer} from '@nozbe/watermelondb/decorators';

const sanitizeServices = (rawServices: any[]) => {
  return Array.isArray(rawServices) ? rawServices.map(String) : [];
};

export default class SensorModel extends Model {
  static table = 'sensors';

  @field('name') name!: string;
  @field('address') address!: string;
  @field('is_primary') is_primary!: boolean;
  @field('type') type!: string;
  @json('sensorType', sanitizeServices) sensorType: any;
  @date('created_at') createdAt!: number;

  @writer async deleteSensor() {
    console.log('Deleting sensor...');
    return await this.destroyPermanently();
  }
}
