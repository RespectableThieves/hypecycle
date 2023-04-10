import React, {useContext, useState} from 'react';
import {Portal, Button, Text, Modal} from 'react-native-paper';
import {Alert, FlatList} from 'react-native';
import {Empty, GroupedButtons} from './styles';
import {Sensor, SensorProps} from '../Sensor';
import globalData from '../../lib/GlobalContext';
import {db} from '../../database';
import {createSensor} from '../../lib/sensor';
import {Q} from '@nozbe/watermelondb';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const _listEmptyComponent = () => {
  return (
    <Empty>
      <Text variant="titleMedium">No sensors found, run a scan!</Text>
    </Empty>
  );
};

const handleError = (err: Error) => {
  Alert.alert('Failed to connect to sensor: ', err.message);
};

export function SensorDiscoveryModal(props: Props) {
  const ble = useContext(globalData).ble;

  const [scanning, setScanning] = useState(false);
  const [discovered, setDiscovered] = useState([]);
  const modalContainerStyle = {backgroundColor: 'black', padding: 20};

  const discoverSensors = async () => {
    setDiscovered([]); //Clear the list each time we run a scan

    const handleScanStop = async () => {
      console.log('Scanning Stopped');
      setScanning(false);
      const sensorList = await ble.getDiscoveredSensors();
      console.log('sensorList: ', sensorList);
      const unpairedList = await Promise.all(
        sensorList.map(async function (val: SensorProps, _index: number) {
          const existsAlready = await db
            .get('sensor')
            ?.query(Q.where('address', val.id))
            .fetchCount();
          if (!existsAlready) {
            console.log('val = ', val);
            return val;
          } else {
            return undefined;
          }
        }),
      );

      const filteredList = unpairedList.filter(Boolean);

      console.log('unpaired list: ', filteredList);
      setDiscovered(filteredList);
    };

    console.log('Starting scan');
    await ble.startSensorDiscovery();
    setScanning(true);
    ble.subscribeToDiscoveryStop(handleScanStop);
  };

  async function handlePair(item: any) {
    // TODO: handle cadence meter too
    if (item.sensorType.includes('CyclingPower')) {
      console.log('Adding Power Meter...');
      try {
        // Write sensor to sensor table.
        await createSensor(item.name, item.id, item.sensorType);
        Alert.alert(`Powermeter: ${item.name} added!`);
      } catch (error) {
        if (error instanceof Error) {
          handleError(error);
        }
      }
    } else if (item.sensorType.includes('HeartRate')) {
      console.log('Adding Heart Rate');
      try {
        // Write sensor to sensor table.
        await createSensor(item.name, item.id, item.sensorType);
        Alert.alert(`Heart Rate ${item.name} added!`);
      } catch (error) {
        if (error instanceof Error) {
          handleError(error);
        }
      }
    }
  }

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={props.onDismiss}
        style={modalContainerStyle}>
        <FlatList<SensorProps>
          data={discovered}
          keyExtractor={item => item?.id}
          ListEmptyComponent={_listEmptyComponent}
          renderItem={({item}) => (
            <Sensor
              data={item}
              onAction={() => handlePair(item)}
              actionIcon="plus-box"
              actionColor="#93B7BE"
            />
          )}
        />
        <GroupedButtons>
          <Button
            id="discovery-modal-scan"
            onPress={discoverSensors}
            loading={scanning}>
            Scan
          </Button>
          <Button id="discovery-modal-close" onPress={props.onDismiss}>
            close
          </Button>
        </GroupedButtons>
      </Modal>
    </Portal>
  );
}
