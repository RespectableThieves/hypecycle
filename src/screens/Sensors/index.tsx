import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { Container, Title } from './styles';

import { dataBase } from '../../database';
import SensorModel from '../../database/model/sensorModel';
import { Q } from '@nozbe/watermelondb';
import { Button } from '../../components/Button';
import { createSensor, getAllSensors } from '../../database/sensor/utils';

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
    await createSensor("test3", "AB:01:23:FF", [])
    await createSensor("test4", "34:01:03:1F", ['2a0f'])
      
      Alert.alert('Created!');
  }

  async function deleteOne() {
    const allSensors = await getAllSensors()
    const sensor = allSensors[0]
    console.log(sensor)
    sensor.deleteSensor()
  }

  useEffect(()=> {

    fetchData();
  }, []);

  return (
    <Container>
      <Title>Sensors</Title>

      <Button title='create' onPress={makeSensors}></Button>
      <Button title='delete' onPress={deleteOne}></Button>
    </Container>
  );
}