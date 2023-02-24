import React, { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';

import { Container, Title } from './styles';

import { dataBase } from '../../database';
import SensorModel from '../../database/model/sensorModel';
import { Q } from '@nozbe/watermelondb';
import { Button } from 'react-native-paper';
import { createSensor, getAllSensors } from '../../database/sensor/utils';
import { Sensor } from '../../components/Sensor';

export function Sensors() {
  const [sensors, setSensors] = useState<SensorModel[]>([]);

  async function fetchData(){
   try {
    const sensorCollection = await dataBase
      .get<SensorModel>('sensors')
      .query(Q.where('type', 'bluetooth'))
      .fetch();
    
      console.log(sensorCollection);
      setSensors(sensorCollection);
      const allSensor = await getAllSensors()
      console.log('All: ',allSensor)
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

  useEffect(()=> {

    fetchData();
  }, []);

  return (
    <Container>
      <Title variant="titleLarge">Sensors</Title>
      <FlatList
        data={sensors}
        keyExtractor={item => item?.id}
        renderItem={({ item }) => (
          <Sensor
            data={item}
            onRemove={() => handleRemove(item)}
          />
        )}
      />

      <Button icon="plus-thick" mode="contained" onPress={makeSensors} buttonColor={'#93B7BE'} textColor={'#454545'}> Add Sensor </Button>
    </Container>
  );
}