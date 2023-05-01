import React from 'react';
import { CenteredView, DataText, Title } from './styles';
import { Dimensions, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';

export type Props = {
  title: string;
  data: number | null | undefined | string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function SimpleMetric({ title, data, icon }: Props) {
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;

  return (
    <Surface
      elevation={1}
      style={styles({ height: (windowHeight - headerHeight + 6) / 3 }).surface}>
      <Title>
        {title}
        <MaterialCommunityIcons name={icon} />
      </Title>

      <CenteredView>
        <DataText variant="displaySmall">{data || '--'}</DataText>
      </CenteredView>
    </Surface>
  );
}

const styles = ({ height }: { height: number }) =>
  StyleSheet.create({
    surface: {
      borderRadius: 5,
      height,
    },
  });
