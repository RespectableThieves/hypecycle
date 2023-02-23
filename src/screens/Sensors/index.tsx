import React, { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';

import { Container, Title } from './styles';

import { dataBase } from '../../database';
import SensorModel from '../../database/model/sensorModel';
import { Q } from '@nozbe/watermelondb';
import { Button, useTheme } from 'react-native-paper';
import { createSensor, getAllSensors } from '../../database/sensor/utils';
import { Sensor } from '../../components/Sensor';

export function Sensors() {
  const theme = useTheme();
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
    await createSensor("test3", "AB:01:23:FF", [])
    await createSensor("test4", "34:01:03:1F", ['2a0f'])
    await fetchData();  
    Alert.alert('Created!');
  }

  async function deleteOne() {
    const allSensors = await getAllSensors()
    const sensor = allSensors[0]
    console.log(sensor)
    sensor.deleteSensor()
  }

  async function handleRemove(item: SensorModel){
    try {

      await item.deleteSensor()
      
       Alert.alert('Deleted!');
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
      <Title>Sensors</Title>
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

      <Button icon="camera" mode="contained" onPress={makeSensors} style={{ backgroundColor: theme.colors.roseTaupe }}> Create </Button>
    </Container>
  );
}