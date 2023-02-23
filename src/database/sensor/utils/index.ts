import { dataBase } from '../..';
import SensorModel from '../../model/sensorModel';

export async function createSensor(name: string, address: string, services: string[], type: string = "bluetooth"){
    console.log('creating...')
    await dataBase.write(async() => {
        await dataBase
        .get<SensorModel>('sensors')
        .create(data => {
          data.name = name,
          data.type = type,
          data.address = address,
          data.services = services,
          data.createdAt = new Date().getTime()
          console.log(data)
        })
        .catch(err => {
            console.log('got error creating sensor: ',err)
            throw(err)
        })
      });
  }

export async function getAllSensors() {
  return await dataBase.get<SensorModel>('sensors').query().fetch()
}