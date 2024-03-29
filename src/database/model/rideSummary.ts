import {Model, Relation} from '@nozbe/watermelondb';
import {field, readonly, date, writer} from '@nozbe/watermelondb/decorators';
import {immutableRelation} from '@nozbe/watermelondb/decorators';
import Ride from './ride';

export default class RideSummaryModel extends Model {
  static table = 'ride_summary';

  @field('distance') distance!: number;
  @field('moving_time') movingTime!: number;
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
  @field('strava_id') stravaId!: number | null;
  @immutableRelation('ride', 'ride_id') ride!: Relation<Ride>;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @writer async setStravaId(stravaId: number) {
    await this.update(summary => {
      summary.stravaId = stravaId;
    });
  }
}
