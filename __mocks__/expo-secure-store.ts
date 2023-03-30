export const data: {[key: string]: string} = {};

export function getItemAsync(key: string) {
  return Promise.resolve(data[key]);
}

export function setItemAsync(key: string, value: string) {
  data[key] = value;
  return Promise.resolve();
}

export function deleteItemAsync(key: string) {
  delete data[key];
}

export function clearAll() {
  Object.keys(data).forEach(key => delete data[key]);
  return Promise.resolve();
}
