import React from 'react';
import {CenteredView, DataText, OuterView, Title} from './styles';
import {Dimensions} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {MaterialCommunityIcons} from '@expo/vector-icons';

type Props = {
  title: string;
  data: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function SimpleMetric({title, data, icon}: Props) {
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;

  return (
    <OuterView widgetHeight={(windowHeight - headerHeight + 6) / 3}>
      <Title>
        {title}
        <MaterialCommunityIcons name={icon} />
      </Title>

      <CenteredView>
        <DataText variant="displaySmall">{data}</DataText>
      </CenteredView>
    </OuterView>
  );
}
