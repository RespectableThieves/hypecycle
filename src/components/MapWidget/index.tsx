import React from 'react';
import { OuterView, StyledMapView, Title } from './styles'
import { Dimensions, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { enableLatestRenderer } from 'react-native-maps';
import { Polyline } from 'react-native-maps';

enableLatestRenderer();

type Props = {
  title: string;
  data: any;
}

export function MapWidget({ title, data }: Props) {
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;
    
  return (

        <StyledMapView widgetHeight={(windowHeight-headerHeight+12)}
            initialRegion={{
                latitude: 41.4122853,
                longitude: 2.152548,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}>	
            <Polyline
                coordinates={[
                    { latitude: 37.8025259, longitude: -122.4351431 },
                    { latitude: 37.7896386, longitude: -122.421646 },
                    { latitude: 37.7665248, longitude: -122.4161628 },
                    { latitude: 37.7734153, longitude: -122.4577787 },
                    { latitude: 37.7948605, longitude: -122.4596065 },
                    { latitude: 37.8025259, longitude: -122.4351431 }
                ]}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                strokeColors={[
                    '#7F0000',
                    '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                    '#B24112',
                    '#E5845C',
                    '#238C23',
                    '#7F0000'
                ]}
                strokeWidth={6}
            />
        </StyledMapView>

  );
}