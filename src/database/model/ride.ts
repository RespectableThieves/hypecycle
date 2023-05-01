import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class RideModel extends Model {
  static table = 'ride';

  @field('is_paused') isPaused!: boolean;
  @date('started_at') startedAt!: Date;
  @date('ended_at') endedAt!: Date | null;
}
