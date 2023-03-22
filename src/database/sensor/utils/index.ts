import {dataBase} from '../..';
import SensorModel from '../../model/sensorModel';

export async function createSensor(
  name: string,
  address: string,
  services: string[],
  type: string = 'bluetooth',
): Promise<SensorModel> {
  console.log('creating...');
  return dataBase.write(async () => {
    return dataBase
      .get<SensorModel>('sensor')
      .create(data => {
        data.name = name;
        data.type = type;
        data.address = address;
        data.sensorType = services;
        data.createdAt = new Date().getTime();
        console.log('creating sensor', data);
        return data;
      })
      .catch(err => {
        console.log('got error creating sensor: ', err);
        throw err;
      });
  });
}

export function getAllSensors() {
  return dataBase.get<SensorModel>('sensor').query().fetch();
}
