import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class RideModal extends Model {
  static table = 'rides';

  @field('is_paused') isPaused!: boolean;
  @date('started_at') startedAt!: number;
  @date('ended_at') endedAt!: number;
}
