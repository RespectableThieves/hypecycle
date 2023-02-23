import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons'; 

import { Container, Icon, Name, Options, Option } from './styles';

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
    <Container>
      <Icon type={data.type}>
        <FontAwesome5
          name={data.type === "bluetooth" ? "bluetooth-b" : "wifi"}
          color="#FFF"
          size={20}
        />
      </Icon>

      <Name>{data.name}</Name>
      <Name>{data.address}</Name>

      <Options>
        <Option onPress={onRemove}>
          <FontAwesome5
            name="trash"
            color="#EE3B45"
            size={20}
          />
        </Option>
      </Options>
    </Container>
  );
}