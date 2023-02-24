export function bleCharacteristicToIconName(char: string): string {
    switch (char) {
    case '180f':
        // Battery Service
        return "battery-bluetooth-variant"
    case '180d':
        // Heart rate service
        return "heart-pulse"
    case '1818':
        // Cycling Power
        return "lightning-bolt"
    case '1816':
        // Cycling Speed And Cadence
        return "unicycle"
    default:
        return ""
    }
}