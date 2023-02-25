import React from 'react';
import { OuterView, Title } from './styles'
import { Dimensions, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

type Props = {
  title: string;
  data: any;
}

export function MapWidget({ title, data }: Props) {
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;

  return (
    <OuterView widgetHeight={(windowHeight-headerHeight+12)}>
        <Title>{title}</Title>
    </OuterView>
  );
}