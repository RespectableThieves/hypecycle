import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class RealtimeDataModel extends Model {
  static table = 'realtime_data';

  @field('distance') distance!: number | null;
  @field('elapsed_time') elapsedTime!: number | null;
  @field('speed') speed!: number | null;
  @field('latitude') latitude!: number | null;
  @field('longitude') longitude!: number | null;
  @field('altitude') altitude!: number | null;
  @field('heading') heading!: number | null;
  @field('heart_rate') heartRate!: number | null;
  @field('instant_power') instantPower!: number | null;
  @field('three_sec_power') threeSecPower!: number | null;
  @field('ten_sec_power') tenSecPower!: number | null;
  @field('cadence') cadence!: number | null;
  @field('is_bluetooth') isBluetooth!: boolean;
  @field('is_wifi') isWifi!: boolean;
  @field('is_power') isPower!: boolean;
  @field('is_heart_rate') isHeartRate!: boolean;
  @field('is_cadence') isCadence!: boolean;
  @date('created_at') createdAt!: number;
}
