import {startRide, stopRide, saveRideSummary} from '../ride';
import {
  updateRealTimeRecordRandom,
  getOrCreateRealtimeRecord,
  onSnapshotEvent,
} from './realtime';
import {generateTCX, historyToGeoJSON, getRideHistory} from './history';
import {TrainingCenterDatabase} from 'tcx-builder';
import {FeatureCollection, Feature, LineString, Point} from 'geojson';

it('generate a tcx from ride summary', async () => {
  jest.useFakeTimers();
  const snapshotCount = 5;
  const realtime = await getOrCreateRealtimeRecord();
  const ride = await startRide();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (let _x in [...Array(snapshotCount).keys()]) {
    jest.advanceTimersByTime(3000);
    await updateRealTimeRecordRandom(realtime);
    await onSnapshotEvent();
  }
  await stopRide(ride);
  const rideSummary = await saveRideSummary(ride);
  const tcx = await generateTCX(rideSummary);

  expect(tcx).toBeInstanceOf(TrainingCenterDatabase);
  const trackPoints = tcx.Activities?.Activity![0].Laps[0].Track!.TrackPoints!;
  expect(trackPoints.length).toBe(snapshotCount);

  expect(trackPoints[trackPoints.length - 1].Cadence).toBe(realtime.cadence);
  expect(trackPoints[trackPoints.length - 1].Extensions?.Watts).toBe(
    realtime.instantPower,
  );
}, 20000);

it('should be able to generate geojson object when history is variable lengths.', async () => {
  jest.useFakeTimers();
  const realtime = await getOrCreateRealtimeRecord();
  const ride = await startRide();

  let history = await getRideHistory(ride.id);
  const geojson = historyToGeoJSON(history);
  expect(geojson).toBe(null);

  jest.advanceTimersByTime(3000);
  await updateRealTimeRecordRandom(realtime);
  await onSnapshotEvent();

  // now we should get a coords point.
  history = await getRideHistory(ride.id);
  const pointGeojson = historyToGeoJSON(history) as Feature<Point>;
  expect(pointGeojson!.type).toBe('Feature');
  expect(pointGeojson!.geometry.type).toBe('Point');

  jest.advanceTimersByTime(3000);
  await updateRealTimeRecordRandom(realtime);
  await onSnapshotEvent();

  // now we should get a linestring
  history = await getRideHistory(ride.id);
  const lineGeojson = historyToGeoJSON(
    history,
  ) as FeatureCollection<LineString>;
  expect(lineGeojson!.type).toBe('FeatureCollection');

  expect(lineGeojson!.features[0].geometry.type).toBe('LineString');
  expect(lineGeojson!.features[0].geometry.coordinates.length).toBe(2);
  expect(lineGeojson!.features[1].geometry.type).toBe('Point');
  expect(lineGeojson!.features[1].properties).toEqual({
    title: 'start',
    icon: 'markerStroked',
  });
  expect(lineGeojson!.features[2].geometry.type).toBe('Point');
  expect(lineGeojson!.features[2].properties).toEqual({
    title: 'end',
    icon: 'marker',
  });

  await stopRide(ride);
});
