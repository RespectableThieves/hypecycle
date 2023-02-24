import React from 'react';
import { List } from 'react-native-paper';

type Props = {
  data: string[];
}

export function SensorServiceIcons({ data }: Props) {
  return (
    <>
        <List.Icon icon="heart"/>
        <List.Icon icon="lightning-bolt"/>
        <List.Icon icon="unicycle"/>
    </>
  );
}