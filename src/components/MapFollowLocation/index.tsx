import React, {useRef, useState} from 'react';
import {FAB} from 'react-native-paper';
import {
  StyleURL,
  UserLocation,
  MapView,
  UserTrackingMode,
  Camera,
} from '@rnmapbox/maps';
import {Dimensions, StyleSheet} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {Portal} from 'react-native-paper';

export default function MapWidget() {
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;
  const [followUserMode, setFollowUserMode] = useState<UserTrackingMode | null>(
    UserTrackingMode.FollowWithHeading,
  );
  const camera = useRef<Camera>(null);
  const styles = getStyles(windowHeight - headerHeight + 12);

  const followUserProps = {
    followUserLocation: !!followUserMode,
    ...(followUserMode && {followUserMode}),
  };

  return (
    <Portal.Host>
      <MapView
        logoEnabled={false}
        scaleBarEnabled={false}
        styleURL={StyleURL.Dark}
        style={styles.map}
        attributionPosition={{bottom: 10, left: 5}}>
        <UserLocation showsUserHeadingIndicator={true} />
        <Camera
          ref={camera}
          onUserTrackingModeChange={e => {
            const {followUserMode: fMode} = e.nativeEvent.payload;
            setFollowUserMode(fMode);
          }}
          {...followUserProps}
        />
      </MapView>
      <Portal>
        <FAB
          style={styles.fab}
          small
          icon="compass"
          onPress={() => {
            setFollowUserMode(UserTrackingMode.FollowWithHeading);
          }}
        />
      </Portal>
    </Portal.Host>
  );
}

const getStyles = (height: number) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    map: {
      flex: 1,
      height: height,
      borderRadius: 8,
    },
  });
