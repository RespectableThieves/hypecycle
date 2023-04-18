import React from 'react';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {View, StyleSheet} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import withObservables from '@nozbe/with-observables';
import {db, RealtimeDataModel} from '../../database';
import Constants from '../../constants';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const IconAnimated = Animated.createAnimatedComponent(MaterialCommunityIcons);

const DeviceStatus = ({realtimeData}: {realtimeData: RealtimeDataModel}) => {
  const opacity = useSharedValue(0);

  // Set the opacity value to animate between 0 and 1
  opacity.value = withRepeat(
    withTiming(1, {duration: 1000, easing: Easing.ease}),
    -1,
    true,
  );

  const style = useAnimatedStyle(() => ({opacity: opacity.value}), []);

  console.log({
    isPower: realtimeData.isPower,
    isHeartRate: realtimeData.isHeartRate,
    isCadence: realtimeData.isCadence,
  });
  return (
    <View style={styles(realtimeData).View}>
      {realtimeData.isHeartRate !== null && (
        <IconAnimated
          style={!realtimeData.isHeartRate && style}
          color="#fff"
          name={'heart-pulse'}
        />
      )}
      {realtimeData.isPower !== null && (
        <IconAnimated
          style={!realtimeData.isPower && style}
          color="#fff"
          name={'lightning-bolt'}
        />
      )}
      {realtimeData.isCadence !== null && (
        <IconAnimated
          style={!realtimeData.isCadence && style}
          color="#fff"
          name={'unicycle'}
        />
      )}
      <StatusBar style="light" />
    </View>
  );
};

const enhance = withObservables([], () => ({
  realtimeData: db
    .get<RealtimeDataModel>('realtime_data')
    .findAndObserve(Constants.realtimeDataId),
}));

export default enhance(DeviceStatus);

const styles = (realtimeData: RealtimeDataModel) =>
  StyleSheet.create({
    View: {
      // TODO we should use expo-constants.NativeConstants.height
      // need a new native build to pull that in.
      height: 30,
      display: 'flex',
      backgroundColor: realtimeData.ride?.id ? 'red' : '#000',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 0,
    },
  });
