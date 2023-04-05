import React from 'react';
import { CenteredView, DataText, OuterView, Title } from './styles';
import { Dimensions } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface, Text } from 'react-native-paper';

type Props = {
  title: string;
  data: number | null;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function SimpleMetric({ title, data, icon }: Props) {
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;

  return (
    <Surface elevation={0} style={{ height: (windowHeight - headerHeight + 6) / 3 }}>
      <Title>
        {title}
        <MaterialCommunityIcons name={icon} />
      </Title>

      <CenteredView>
        <DataText variant="displaySmall">{data || '--'}</DataText>
      </CenteredView>
    </Surface >
  );
}
