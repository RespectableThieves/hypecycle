import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class RealtimeDataModel extends Model {
  static table = 'realtime_data';

  @field('distance') distance!: number;
  @field('elapsed_time') elapsedTime!: number;
  @field('speed') speed!: number;
  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @field('altitude') altitude!: number;
  @field('heading') heading!: number;
  @field('heart_rate') heartRate!: number;
  @field('instant_power') instantPower!: number;
  @field('three_sec_power') threeSecPower!: number;
  @field('ten_sec_power') tenSecPower!: number;
  @field('cadence') cadence!: number;
  @field('is_bluetooth') isBluetooth!: boolean;
  @field('is_wifi') isWifi!: boolean;
  @field('is_power') isPower!: boolean;
  @field('is_heart_rate') isHeartRate!: boolean;
  @field('is_cadence') isCadence!: boolean;
  @date('created_at') createdAt!: number;
}
