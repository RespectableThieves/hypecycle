import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import withObservables from '@nozbe/with-observables';
import { db, RealtimeDataModel } from '../../database'
import Constants from '../../constants'
import ExpoConstants from 'expo-constants'

const DeviceStatus = () => {
  return (
    <View
      style={{
        height: ExpoConstants.NativeConstants.statusBarHeight,
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        flexDirection: 'row'
      }}>
      <MaterialCommunityIcons color="#fff" name={"heart-pulse"} />
      <MaterialCommunityIcons color="#fff" name={"lightning-bolt"} />
      <MaterialCommunityIcons color="#fff" name={"unicycle"} />
      <StatusBar style="light" />
    </View>
  )

};


const enhance = withObservables([], () => ({
  realtimeData: db
    .get<RealtimeDataModel>('realtime_data')
    .findAndObserve(Constants.realtimeDataId),
}));

export default enhance(DeviceStatus)
