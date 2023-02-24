import React, { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';

import { Container, Empty } from './styles';

import { dataBase } from '../../database';
import SensorModel from '../../database/model/sensorModel';
import { Q } from '@nozbe/watermelondb';
import { Button, Text } from 'react-native-paper';
import { createSensor, getAllSensors } from '../../database/sensor/utils';
import { Sensor } from '../../components/Sensor';

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

  async function fetchData(){
   try {
    const sensorCollection = await dataBase
      .get<SensorModel>('sensors')
      .query(Q.where('type', 'bluetooth'))
      .fetch();
    
      setSensors(sensorCollection);
      const allSensor = await getAllSensors()
      const numberOfBluetoothSensors = await dataBase.get('sensors').query(
        Q.where('type', 'bluetooth')
      ).fetchCount()
      console.log('ble sensors = ', numberOfBluetoothSensors);
   }  catch (error) {
      console.log(error);
    }
  }
  
  async function makeSensors(){
    console.log('creating...')
    const sensor = await dataBase.get<SensorModel>('sensors')
    await createSensor("Garmin HRM Pro", "AB:01:23:FF", ['180d'])
    await createSensor("Tacx Neo 2T", "34:01:03:1F", ['1818','1816'])
    await fetchData();  
    Alert.alert('Created!');
  }

  async function handleRemove(item: SensorModel){
    try {

      await item.deleteSensor()
      
      //  Alert.alert('Deleted!');
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
        <Button icon="plus-thick" mode="contained" onPress={makeSensors} buttonColor={'#93B7BE'} textColor={'#454545'}>Add</Button>
      ),
    });
  }, [navigation]);

  return (
    <Container>
      <FlatList
        data={sensors}
        keyExtractor={item => item?.id}
        ListEmptyComponent={_listEmptyComponent}
        renderItem={({ item }) => (
          <Sensor
            data={item}
            onAction={() => handleRemove(item)}
            actionIcon="trash"
            actionColor="#EE3B45"
          />
        )}
      />
    </Container>
  );
}