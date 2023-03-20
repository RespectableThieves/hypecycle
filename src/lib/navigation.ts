import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params = {}) {
  if (navigationRef.isReady()) {
    // TODO improve typing here.
    // @ts-ignore
    return navigationRef.navigate(name, params);
  }
}
