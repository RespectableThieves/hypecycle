import {db, Q, HistoryModel, RideSummaryModel, RideModel} from '../../database';
import {
  TrainingCenterDatabase,
  Activity,
  ActivityLap,
  Track,
  TrackPoint,
  Position,
  HeartRateBpm,
  TrackPointExtensions,
  ActivityList,
  HeartRateInBeatsPerMinute,
} from 'tcx-builder';
import * as FileSystem from 'expo-file-system';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';

export async function getRideHistory(rideId: RideModel['id']) {
  return db.get<HistoryModel>('history').query(Q.where('ride_id', rideId));
}

export function historyToGeoJSON(
  history: HistoryModel[],
): Feature<Point> | FeatureCollection<LineString | Point> | null {
  const coordinates = history
    .map(h => {
      if (!h.longitude || !h.latitude) {
        return null;
      }
      return [h.longitude, h.latitude];
    })
    .filter((coord): coord is number[] => coord !== null);

  if (coordinates.length === 0) {
    return null;
  }

  if (coordinates.length === 1) {
    return {
      type: 'Feature',
      properties: {
        title: 'start',
        icon: 'marker',
      },
      geometry: {
        coordinates: coordinates[0],
        type: 'Point',
      },
    };
  }

  const start = coordinates[0];
  const end = coordinates[coordinates.length - 1];

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates,
          type: 'LineString',
        },
      },
      {
        type: 'Feature',
        properties: {
          title: 'start',
          icon: 'markerStroked',
        },
        geometry: {
          coordinates: start,
          type: 'Point',
        },
      },
      {
        type: 'Feature',
        properties: {
          title: 'end',
          icon: 'marker',
        },
        geometry: {
          coordinates: end,
          type: 'Point',
        },
      },
    ],
  };
}

export async function generateTCX(rideSummary: RideSummaryModel) {
  const records = await getRideHistory(rideSummary.ride.id);

  const trackPoints: TrackPoint[] = [];
  for (const record of records) {
    trackPoints.push(
      new TrackPoint({
        time: new Date(record.createdAt),
        ...(record.latitude &&
          record.longitude && {
            position: new Position(record.latitude, record.longitude),
          }),
        ...(record.altitude && {altitudeMeters: record.altitude}),
        distanceMeters: record.distance,
        ...(record.heartRate && {
          heartRateBpm: new HeartRateBpm(record.heartRate),
        }),
        ...(record.cadence && {cadence: record.cadence}),
        ...(record.cadence && {runcadence: record.cadence}),
        ...(record.instantPower && {watts: record.instantPower}),
        sensorState: 'Present',
        extensions: new TrackPointExtensions({
          ...(record.speed && {Speed: record.speed}),
          ...(record.instantPower && {Watts: record.instantPower}),
        }),
      }),
    );
  }

  const myLap: ActivityLap = new ActivityLap(new Date(rideSummary.createdAt), {
    Calories: 0,
    Intensity: 'Active',
    TriggerMethod: 'Manual',
    DistanceMeters: records[records.length - 1]?.distance || 0,
    TotalTimeSeconds: rideSummary.elapsedTime,
    Track: new Track({trackPoints}),
    ...(rideSummary.maxSpeed && {MaximumSpeed: rideSummary.maxSpeed}),
    ...(rideSummary.avgCadence && {Cadence: rideSummary.avgCadence}),
    ...(rideSummary.avgHr && {
      AverageHeartRateBpm: new HeartRateInBeatsPerMinute({
        value: rideSummary.avgHr,
      }),
    }),
    ...(rideSummary.maxHr && {
      MaximumHeartRateBpm: new HeartRateInBeatsPerMinute({
        value: rideSummary.maxHr,
      }),
    }),
  });

  const tcxActivity = new Activity('Biking', {
    Id: new Date(rideSummary.createdAt),
    Laps: [myLap],
    Notes: `Hypecycle test ride - ${rideSummary.ride.id}`,
  });
  const activityList = new ActivityList({activity: [tcxActivity]});

  const tcxObj = new TrainingCenterDatabase({activities: activityList});

  return tcxObj;
}

export async function saveTCX(
  uri: string,
  tcx: TrainingCenterDatabase,
): Promise<string> {
  const xml = tcx.toXml();
  await FileSystem.writeAsStringAsync(uri, xml);
  return uri;
}
