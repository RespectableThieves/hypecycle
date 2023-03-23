import React from 'react';
import {List} from 'react-native-paper';
import {bleCharacteristicToIconName} from '../../lib/sensor';

type Props = {
  data: string[];
};

export function SensorServiceIcons({data}: Props) {
  const listIcons = data.map((char, index) => (
    <List.Icon key={index} icon={bleCharacteristicToIconName(char)} />
  ));
  return <>{listIcons}</>;
}
