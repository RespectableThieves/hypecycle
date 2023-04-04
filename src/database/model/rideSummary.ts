import { Model, Relation } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';
import { immutableRelation } from '@nozbe/watermelondb/decorators';
import Ride from './ride';

export default class RideSummaryModal extends Model {
  static table = 'ride_summary';

  @field('distance') distance!: number;
  @field('elapsed_time') elapsedTime!: number;
  @field('avg_speed') avgSpeed!: number;
  @field('avg_power') avgPower!: number;
  @field('avg_cadence') avgCadence!: number;
  @field('max_speed') maxSpeed!: number;
  @field('max_power') maxPower!: number;
  @field('max_cadence') maxCadence!: number;
  @field('max_altitude') maxAltitude!: number;
  @field('max_hr') maxHr!: number;
  @field('avg_hr') avgHr!: number;
  @field('min_hr') minHr!: number;
  @field('accumulated_accent') accumulatedAccent!: number;
  @field('accumulated_decent') accumulatedDecent!: boolean;
  @field('file_uri') fileURI!: string;
  // once we upload to strava we store the activity ID
  // so we can create links.
  @field('strava_id') stravaID!: string | null;
  @immutableRelation('ride', 'ride_id') ride!: Relation<Ride>;
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}
