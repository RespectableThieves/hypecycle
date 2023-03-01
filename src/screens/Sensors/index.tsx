import React, { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';

import { Container, Empty } from './styles';

import { dataBase } from '../../database';
import SensorModel from '../../database/model/sensorModel';
import { Q } from '@nozbe/watermelondb';
import { Button, Text } from 'react-native-paper';
import { createSensor, getAllSensors } from '../../database/sensor/utils';
import { Sensor } from '../../components/Sensor';
import { SensorDiscoveryModal } from '../../components/SensorDiscoveryModal';

const _listEmptyComponent = () => {
  console.log("Empty list")
  return (
      <Empty>
          <Text variant="titleMedium">No Connected Sensors yet... Try add some!</Text>
      </Empty>
  )
}

export function Sensors({ navigation }) {
  const [sensors, setSensors] = useState<SensorModel[]>([]);
  const [visible, setVisible] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false)

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  async function fetchData(){
    // Get list paired bluetooth sensors from our DB.
    setRefreshing(true)
   try {
      setRefreshing(true)
      console.log("Fetching paired sensors from DB...")
      const allSensor = await getAllSensors()
      setSensors(allSensor);
      setRefreshing(false)
      const numberOfBluetoothSensors = await dataBase.get('sensors').query(
        Q.where('type', 'bluetooth')
      ).fetchCount()
      console.log('ble sensors = ', numberOfBluetoothSensors);
   }  catch (error) {
      console.log(error);
    }
  }
  
  async function makeSensors(){
    // Create some fake sensors to test with.
    console.log('creating...')
    const sensor = dataBase.get<SensorModel>('sensors')
    await createSensor("Garmin HRM Pro", "AB:01:23:FF", ['HeartRate','Battery'])
    await createSensor("Tacx Neo 2T", "34:01:03:1F", ['CyclingPower','CyclingSpeedAndCadence','Battery'])
    await fetchData();  
    Alert.alert('Created!');
  }

  async function handleRemove(item: SensorModel){
    // Remove the selected sensor and refetch data.
    try {
      await item.deleteSensor()
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Button icon="plus-thick" mode="contained" onPress={showModal} buttonColor={'#93B7BE'} textColor={'#454545'}>Add</Button>
      ),
    });
    fetchData();
  }, [navigation]);

  return (
    <Container>
      <FlatList
        data={sensors}
        keyExtractor={item => item?.id}
        ListEmptyComponent={_listEmptyComponent}
        onRefresh={fetchData}
        refreshing={isRefreshing}
        renderItem={({ item }) => (
          <Sensor
            data={item}
            onAction={() => handleRemove(item)}
            actionIcon="trash-can"
            actionColor="#EE3B45"
          />
        )}
      />
      <SensorDiscoveryModal visible={visible} onDismiss={hideModal}/>
      <Button style={{marginTop: 30}} onPress={makeSensors}>
        Create fake sensors
      </Button>
    </Container>
  );
}