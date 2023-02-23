import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { Container, Title } from './styles';

import { dataBase } from '../../database';
import SensorModel from '../../database/model/sensorModel';
import { Q } from '@nozbe/watermelondb';
import { Button } from '../../components/Button';

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
   }  catch (error) {
      console.log(error);
    }
  }
  
  async function createSensor(){
    console.log('creating...')
    await dataBase.write(async() => {
        console.log('writing to db...')
        await dataBase
        .get<SensorModel>('sensors')
        .create(data => {
          console.log('Inside .create...')
          console.log(data)
          data.name = "Test2",
          data.type = "bluetooth",
          data.address = "00:00:00:00",
          data.services = ['0a36','2a65'],
          data.createdAt = new Date().getTime()
          console.log(data)
        })
        .catch(err => {
            console.log('got error creating sensor: ',err)
        })
      });
      
      Alert.alert('Created!');
  }

  useEffect(()=> {

    fetchData();
  }, []);

  return (
    <Container>
      <Title>Sensors</Title>

      <Button title='create' onPress={createSensor}></Button>
    </Container>
  );
}