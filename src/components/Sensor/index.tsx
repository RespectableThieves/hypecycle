import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { Container, Icon, Name, Options, Option, StyledListItem, VerticalDivider } from './styles';
import { Divider, List, ListIconProps } from 'react-native-paper';
import { View } from 'react-native';
import { SensorServiceIcons } from '../SensorServiceIcons';

export type SensorProps = {
  id: string;
  name: string;
  is_primary: boolean;
  sensorType: string[];
  type: string;
}

type Props = {
  data: SensorProps;
  onAction: () => void;
  actionIcon: string;
  actionColor: string;
}

export function Sensor({ data, onAction, actionIcon, actionColor }: Props) {
  return (
    <View>
      <StyledListItem
        title={data.name}
        description={data.id}
        left={(Props: any) => <List.Icon {...Props} icon="bluetooth"/>}
        right={() => <Options>
                        <SensorServiceIcons data={data.sensorType}/>
                        <VerticalDivider></VerticalDivider>
                        <Option onPress={onAction}>
                          <MaterialCommunityIcons
                            name={actionIcon}
                            color={actionColor}
                            size={20}
                          />
                        </Option>
                    </Options>}
      />
    </View>
  );
}