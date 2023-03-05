import React, { useContext, useState } from 'react';
import { Portal, Button, Text } from 'react-native-paper';
import { Alert, FlatList, Modal, View } from 'react-native';
import { Empty, GroupedButtons } from './styles';
import { Sensor } from '../Sensor';
import globalData from '../../lib/GlobalContext';
import { dataBase } from '../../database';
import { createSensor } from '../../database/sensor/utils';
import { Q } from '@nozbe/watermelondb';

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

const handleError = (err) => {
  Alert.alert('Failed to connect to sensor: ',err);
}

export function SensorDiscoveryModal(props: Props) {
    const ble = useContext(globalData).ble;
    const pm = useContext(globalData).powerMeter;
    const cm = useContext(globalData).cadenceMeter;
    const hrm = useContext(globalData).heartRateMonitor;

    const [scanning, setScanning] = useState(false)
    const [discovered, setDiscovered] = useState([])
    const containerStyle = {backgroundColor: 'white', padding: 20};
    
    const discoverSensors = async ()=>{
      setDiscovered([]); //Clear the list each time we run a scan
      const handleScanStop = async () => {
        console.log('Scanning Stopped');
        setScanning(false);
        const sensorList = await ble.getDiscoveredSensors();
        console.log('sensorList: ',sensorList)
        const unpairedList = await Promise.all(sensorList.map(async function(val, index) {
          const existsAlready = await dataBase.get('sensors').query(
            Q.where('address', val.id)
          ).fetchCount();
          if (!existsAlready) {
            console.log('val = ', val);
            return val;
          } else {
            return undefined;
          }
        }));
      
        const filteredList = unpairedList.filter(Boolean);
      
        console.log('unpaired list: ', filteredList);
        setDiscovered(filteredList)
      };

      console.log("Starting scan")
      await ble.startSensorDiscovery();
      setScanning(true);
      ble.subscribeToDiscoveryStop(handleScanStop)
    }
    
      async function handlePair(item: any){
        if (item.sensorType.includes('CyclingPower')) {
          console.log('Pairing Power Meter...')
          pm.address = item.id; 
          try {
            await pm.connect()
            console.log('Power Connection successful: ', item.id)
            // Write sensor to sensor table.
            await createSensor(item.name, item.id, item.sensorType)
            Alert.alert('Powermeter connected!');
          } catch (error) {
            handleError(error)
          } 
        } else if (item.sensorType.includes('HeartRate')) {
          console.log('Pairing Heart Rate')
          hrm.address = item.id;
          try {
            await hrm.connect()
            console.log('HR Connection successful: ', item.id)
            // Write sensor to sensor table.
            await createSensor(item.name, item.id, item.sensorType)
            Alert.alert('Heart Rate connected!');
          } catch (error) {
            handleError(error)
          }
        } 
    }

  return (
    <Portal>
        <Modal visible={props.visible} onDismiss={props.onDismiss} onShow={discoverSensors} style={containerStyle}>
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
            <GroupedButtons style={{flexDirection: 'row'}}>
              <Button onPress={discoverSensors} loading={scanning}>
                  Scan
              </Button>
              <Button onPress={props.onDismiss}>
                  close
              </Button>
            </GroupedButtons>
        </Modal>
    </Portal>
  );
}