
class Sensor {

  checkState() {
    return true
  }

  start() {
    return Promise.resolve(true)
  }


  requestPermissions() {
    return Promise.resolve(true)
  }
}

const BleSensors = Sensor

const PowerMeter = jest.fn()
const CadenceMeter = jest.fn()
const HeartRateMonitor = jest.fn()

export { BleSensors, PowerMeter, CadenceMeter, HeartRateMonitor };
