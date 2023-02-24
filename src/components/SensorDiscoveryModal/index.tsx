import React from 'react';
import { Portal, Modal, Button, Text } from 'react-native-paper';
import { FlatList } from 'react-native';
import { Container, Empty } from './styles';
import { Sensor } from '../Sensor';
import SensorModel from '../../database/model/sensorModel';

type SensorProps = {
    id: string;
    name: string;
    address: string;
    is_primary: boolean;
    services: string[];
    type: string;
  }

type Props = {
    visible: boolean;
    onDismiss: () => void;
  }

const _listEmptyComponent = () => {
    console.log("Empty list")
    return (
        <Empty>
            <Text variant="titleMedium">No Connected Sensors yet... Try add some!</Text>
        </Empty>
    )
}
export function SensorDiscoveryModal(props: Props) {
    const containerStyle = {backgroundColor: 'white', padding: 20};
    const sensors = [
        {"address": "34:01:03:1F", "id": "1", "is_primary": false, "name": "Tacx Neo 2T", "services": ["180f","1818","1816"], "type": "bluetooth"},
        {"address": "AB:01:23:FF", "id": "2", "is_primary": false, "name": "Garmin HRM Pro", "services": ["180d","180f"], "type": "bluetooth"},
        {"address": "34:01:03:1F", "id": "3", "is_primary": false, "name": "Assioma Duo", "services": ["180f","1818","1816"], "type": "bluetooth"},
        {"address": "AB:01:23:FF", "id": "4", "is_primary": false, "name": "Garmin Forerunner 945", "services": ["180d","180f"], "type": "bluetooth"},
        {"address": "34:01:03:1F", "id": "5", "is_primary": false, "name": "4iii 823421", "services": ["180f","1818","1816"], "type": "bluetooth"}
    ]

    async function handlePair(item: SensorProps){
        console.log("pairing sensor...", item.address)
      }

  return (
    <Portal>
        <Modal visible={props.visible} onDismiss={props.onDismiss} contentContainerStyle={containerStyle}>
            <FlatList
                data={sensors}
                keyExtractor={item => item?.id}
                ListEmptyComponent={_listEmptyComponent}
                renderItem={({ item }) => (
                <Sensor
                    data={item}
                    onAction={() => handlePair(item)}
                    actionIcon="plus-box"
                    actionColor="#EE3B45"
                />
                )}
            />
            <Button style={{marginTop: 30}} onPress={props.onDismiss}>
                close
            </Button>
        </Modal>
    </Portal>
  );
}