import RealtimeDataModel from '../database/model/realtimeDataModel';
import {LocationObject} from 'expo-location';

export type LatLngAlt = {
  lat: number;
  lng: number;
  alt: number;
};

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calc 3D distance between two GPS location points.
export function haversineDistanceWithAltitude(
  point1: LatLngAlt,
  point2: LatLngAlt,
): number {
  const R = 6371e3; // Earth's mean radius in meters
  const lat1Rad = toRadians(point1.lat);
  const lat2Rad = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const surfaceDistance = R * c; // Surface distance in meters
  const altitudeDifference = point2.alt - point1.alt; // Altitude difference in meters

  return Math.sqrt(
    surfaceDistance * surfaceDistance + altitudeDifference * altitudeDifference,
  );
}

// Calculates the distance between the current location and the last RealTimeRecord location and adds that to the currentDistance.
export function accumulateDistance(
  lastRealTimeRecord: RealtimeDataModel,
  currentLocation: LocationObject,
): number {
    if (
        lastRealTimeRecord.latitude === null ||
        lastRealTimeRecord.longitude === null ||
        lastRealTimeRecord.altitude === null
      ) {
        return 0;
      }
  const lastPoint: LatLngAlt = {
    lat: lastRealTimeRecord.latitude,
    lng: lastRealTimeRecord.longitude,
    alt: lastRealTimeRecord.altitude,
  };
  const nextPoint: LatLngAlt = {
    lat: currentLocation.coords.latitude,
    lng: currentLocation.coords.longitude,
    alt: currentLocation.coords.altitude ? currentLocation.coords.altitude : lastRealTimeRecord.altitude, // If we don't have a current Alt then assume we are same alt still.
  };
  const segmentDistance = haversineDistanceWithAltitude(lastPoint, nextPoint);
  return lastRealTimeRecord.distance + segmentDistance;
}
