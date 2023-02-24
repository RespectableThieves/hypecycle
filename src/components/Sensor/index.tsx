import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons'; 

import { Container, Icon, Name, Options, Option, StyledListItem, VerticalDivider } from './styles';
import { Divider, List, ListIconProps } from 'react-native-paper';
import { View } from 'react-native';
import { SensorServiceIcons } from '../SensorServiceIcons';

export type SensorProps = {
  id: string;
  name: string;
  address: string;
  is_primary: boolean;
  type: string;
}

type Props = {
  data: SensorProps;
  onRemove: () => void;
}

export function Sensor({ data, onRemove }: Props) {
  return (
    <View>
      <StyledListItem
        title={data.name}
        description={data.address}
        left={(Props: any) => <List.Icon {...Props} icon={data.type == "bluetooth" ? "bluetooth" : "radio-tower"}/>}
        right={() => <Options>
                        <SensorServiceIcons data={["aaa"]}/>
                        <VerticalDivider></VerticalDivider>
                        <Option onPress={onRemove}>
                          <FontAwesome5
                            name="trash"
                            color="#EE3B45"
                            size={20}
                          />
                        </Option>
                    </Options>}
      />
    </View>
  );
}