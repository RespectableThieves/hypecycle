import React, { useEffect, useRef, useState } from 'react';
import {
  StyleURL,
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  SymbolLayer,
  Images,
} from '@rnmapbox/maps';
import { MD3DarkTheme as Theme } from 'react-native-paper';
import { Dimensions, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import getBounds from '@turf/bbox';
// @ts-ignore
import marker from '../../../assets/marker.png';
// @ts-ignore
import markerStroked from '../../../assets/marker-stroked.png';

const getStyles = (height: number) =>
  StyleSheet.create({
    map: {
      flex: 1,
      borderRadius: 8,
    },
  });

const iconStyles = {
  iconImage: ['get', 'icon'],
};

export default function GeoJSONRoute({ geojson }: { geojson: any }) {
  // Give a geojson line it'll render it.
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;
  const camera = useRef<Camera>(null);
  const styles = getStyles(windowHeight - headerHeight + 12);
  const [loading, setLoading] = useState(true);
  console.log({ styles })

  const images = {
    marker,
    markerStroked,
  };

  useEffect(() => {
    if (geojson) {
      const [minLat, minLng, maxLat, maxLng] = getBounds(geojson);
      camera.current?.fitBounds([minLat, minLng], [maxLat, maxLng], 30);
    }
  }, [geojson, loading]);

  const fillStyle = {
    lineColor: Theme.colors.error,
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 5,
  };

  return (
    <MapView
      onDidFinishLoadingMap={() => {
        setLoading(false);
      }}
      logoEnabled={false}
      scaleBarEnabled={false}
      styleURL={StyleURL.Dark}
      style={styles.map}
      attributionPosition={{ bottom: 10, left: 5 }}>
      <Images images={images} />
      <ShapeSource id="source1" shape={geojson}>
        <LineLayer id="layer1" style={fillStyle} />
        <SymbolLayer style={iconStyles} id="icon1" />
      </ShapeSource>
      <Camera ref={camera} />
    </MapView>
  );
}
