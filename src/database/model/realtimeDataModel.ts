import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class RealtimeDataModel extends Model {
  static table = 'realtime_data';

  @field('distance') distance!: number;
  @field('elapsed_time') elapsed_time!: number;
  @field('speed') speed!: number;
  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @field('altitude') altitude!: number;
  @field('heading') heading!: number;
  @field('heart_rate') heart_rate!: number;
  @field('instant_power') instant_power!: number;
  @field('three_sec_power') three_sec_power!: number;
  @field('ten_sec_power') ten_sec_power!: number;
  @field('cadence') cadence!: number;
  @field('is_bluetooth') is_bluetooth!: boolean;
  @field('is_wifi') is_wifi!: boolean;
  @field('is_power') is_power!: boolean;
  @field('is_power') is_heart_rate!: boolean;
  @field('is_power') is_cadence!: boolean;
  @date('created_at') createdAt!: number;
}
