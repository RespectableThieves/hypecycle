import React, { useContext, useState } from 'react';
import { Portal, Modal, Button, Text } from 'react-native-paper';
import { FlatList } from 'react-native';
import { Empty } from './styles';
import { Sensor } from '../Sensor';
import globalData from '../../lib/GlobalContext';

type SensorProps = {
    id: string;
    name: string;
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
            <Text variant="titleMedium">No sensors found, run a scan!</Text>
        </Empty>
    )
}
export function SensorDiscoveryModal(props: Props) {
    const ble = useContext(globalData).ble;
    const [scanning, setScanning] = useState(false)
    const [discovered, setDiscovered] = useState([])
    const containerStyle = {backgroundColor: 'white', padding: 20};
    
    const discoverSensors = async ()=>{
        const handleScanStop = async () => {
          console.log('Scanning Stopped');
          setScanning(false);
          const sensorList = await ble.getDiscoveredSensors();
          console.log('sensorList: ',sensorList)
          setDiscovered(sensorList)
        };
  
        console.log("Starting scan")
        await ble.startSensorDiscovery();
        setScanning(true);
        ble.subscribeToDiscoveryStop(handleScanStop)
      }

    async function handlePair(item: SensorProps){
        console.log("pairing sensor...", item.id)
    }

  return (
    <Portal>
        <Modal visible={props.visible} onDismiss={props.onDismiss} contentContainerStyle={containerStyle}>
            <FlatList
                data={discovered}
                keyExtractor={item => item?.id}
                ListEmptyComponent={_listEmptyComponent}
                renderItem={({ item }) => (
                <Sensor
                    data={item}
                    onAction={() => handlePair(item)}
                    actionIcon="plus-box"
                    actionColor="#93B7BE"
                />
                )}
            />
            <Button style={{marginTop: 30}} onPress={discoverSensors}>
                Scan
            </Button>
            <Button style={{marginTop: 30}} onPress={props.onDismiss}>
                close
            </Button>
        </Modal>
    </Portal>
  );
}