export function bleCharacteristicToIconName(char: string): string {
    switch (char) {
    case 'Battery':
        // Battery Service
        return "battery-bluetooth-variant"
    case 'HeartRate':
        // Heart rate service
        return "heart-pulse"
    case ('CyclingPower'):
        // Cycling Power
        return "lightning-bolt"
    case 'CyclingSpeedAndCadence':
        // Cycling Speed And Cadence
        return "unicycle"
    default:
        return "ab-testing"
    }
}