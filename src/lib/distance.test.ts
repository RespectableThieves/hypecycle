// distanceCalculator.test.ts

import {
  LatLngAlt,
  accumulateDistance,
  haversineDistanceWithAltitude,
  toRadians,
} from './distance';

describe('haversineDistanceWithAltitude', () => {
  it('returns 0 for the same point', () => {
    const point: LatLngAlt = {lat: 40.7128, lng: -74.006, alt: 10};
    expect(haversineDistanceWithAltitude(point, point)).toBe(0);
  });

  it('returns the correct distance for two different points without altitude difference', () => {
    const point1: LatLngAlt = {lat: 41.38811, lng: 2.19618, alt: 7};
    const point2: LatLngAlt = {lat: 41.39556, lng: 2.20608, alt: 7};
    const distance = haversineDistanceWithAltitude(point1, point2);
    expect(distance).toBeCloseTo(1170.0, 0);
  });

  it('returns the correct distance for two different points with altitude difference', () => {
    const point1: LatLngAlt = {lat: 41.4027, lng: 2.1743, alt: 41.0};
    const point2: LatLngAlt = {lat: 41.4035, lng: 2.1732, alt: 49.0};
    const distance = haversineDistanceWithAltitude(point1, point2);
    expect(distance).toBeCloseTo(128.0, 0); // We want our precision to be with in at least a meter
  });
});

describe('toRadians', () => {
  it('converts degrees to radians', () => {
    expect(toRadians(0)).toBe(0);
    expect(toRadians(45)).toBeCloseTo(0.7854, 4);
    expect(toRadians(90)).toBeCloseTo(1.5708, 4);
    expect(toRadians(180)).toBe(Math.PI);
    expect(toRadians(360)).toBe(2 * Math.PI);
  });
});

// Mocked types
interface RealtimeDataModel { // This type is not a complete version of the data type, so it annoys the typechecker but still works.
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  distance: number;
}

interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
  };
}

describe('accumulateDistance', () => {
  it('returns 0 when any of the lastRealTimeRecord properties are null', () => {
    const lastRealTimeRecord: RealtimeDataModel = {
      latitude: null,
      longitude: 10,
      altitude: 100,
      distance: 0,
    };
    const currentLocation: LocationObject = {
      coords: {
        latitude: 20,
        longitude: 20,
        altitude: 200,
      },
    };
    expect(accumulateDistance(lastRealTimeRecord, currentLocation)).toBe(0);
  });

  it('calculates the correct distance with valid input', () => {
    const lastRealTimeRecord: RealtimeDataModel = {
      latitude: 41.4027,
      longitude: 2.1743,
      altitude: 41.00,
      distance: 100,
    };
    const currentLocation: LocationObject = {
      coords: {
        latitude: 41.4035,
        longitude: 2.1732,
        altitude: 49.00,
      },
    };
    expect(accumulateDistance(lastRealTimeRecord, currentLocation)).toBeCloseTo(228.0, 0);
  });

  it('calculates the correct distance when currentLocation has no altitude', () => {
    const lastRealTimeRecord: RealtimeDataModel = {
      latitude: 41.38811,
      longitude: 2.19618,
      altitude: 7,
      distance: 0,
    };
    const currentLocation: LocationObject = {
      coords: {
        latitude: 41.39556,
        longitude: 2.20608,
        altitude: null,
      },
    };
    expect(accumulateDistance(lastRealTimeRecord, currentLocation)).toBeCloseTo(1170, 0);
  });
});

