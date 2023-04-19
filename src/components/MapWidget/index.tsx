import React from 'react';
import {StyledMapView} from './styles';
import Mapbox from '@rnmapbox/maps';
import {Dimensions} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';

type Props = {
  title: string;
  data: any;
};

export function MapWidget(_: Props) {
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;

  return (
    <StyledMapView
      logoEnabled={false}
      scaleBarEnabled={false}
      styleURL={Mapbox.StyleURL.Dark}
      widgetHeight={windowHeight - headerHeight + 12}
      attributionPosition={{bottom: 10, left: 5}}>
      <Mapbox.UserLocation showsUserHeadingIndicator={true} />
      <Mapbox.Camera followUserLocation={true} />
    </StyledMapView>
  );
}
