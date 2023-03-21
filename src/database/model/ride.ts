import {Model} from '@nozbe/watermelondb';
import {date} from '@nozbe/watermelondb/decorators';

export default class Ride extends Model {
  static table = 'ride';

  @date('started_at') startedAt!: number;
  @date('ended_at') endedAt!: number;

  get isActive() {
    // if it has an endedAt
    // timestamp it is considered complete.
    return !this.endedAt;
  }
}
