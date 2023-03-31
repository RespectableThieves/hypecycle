// distanceCalculator.test.ts

import { LatLngAlt, haversineDistanceWithAltitude, toRadians } from './distance';

describe('haversineDistanceWithAltitude', () => {
  it('returns 0 for the same point', () => {
    const point: LatLngAlt = { lat: 40.7128, lng: -74.0060, alt: 10 };
    expect(haversineDistanceWithAltitude(point, point)).toBe(0);
  });

  it('returns the correct distance for two different points without altitude difference', () => {
    const point1: LatLngAlt = { lat: 41.38811, lng: 2.19618, alt: 7 };
    const point2: LatLngAlt = { lat: 41.39556, lng: 2.20608, alt: 7 };
    const distance = haversineDistanceWithAltitude(point1, point2);
    expect(distance).toBeCloseTo(1170.0, 0);
  });

  it('returns the correct distance for two different points with altitude difference', () => {
    const point1: LatLngAlt = { lat: 41.4027, lng: 2.1743, alt: 41.00 };
    const point2: LatLngAlt = { lat: 41.4035, lng: 2.1732, alt: 49.00 };
    const distance = haversineDistanceWithAltitude(point1, point2);
    expect(distance).toBeCloseTo(128.0,0); // We want our precision to be with in at least a meter
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
