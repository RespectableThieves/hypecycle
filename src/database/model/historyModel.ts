import {Relation, Model} from '@nozbe/watermelondb';
import {relation, field, date} from '@nozbe/watermelondb/decorators';
import Ride from './ride';

export default class HistoryModel extends Model {
  static table = 'history';

  @field('distance') distance!: number;
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
  @date('created_at') createdAt!: number;
  @relation('ride', 'ride_id') ride!: Relation<Ride> | null;
}
