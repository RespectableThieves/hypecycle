function pad(n: number) {
  return ('0' + n).slice(-2);
}


export function formatTimestamp(ts: number): string {
  // given a timestamp in ms
  // returns hh:mm:ss
  ts = Math.floor(ts / 1000)
  const hours = Math.floor(ts / 3600);
  ts -= hours * 3600;
  const minutes = Math.floor(ts / 60);
  ts -= minutes * 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(ts)}`
}
