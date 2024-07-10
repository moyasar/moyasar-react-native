const debugLogs = false;

export function debugLog(message: string): void {
  if (__DEV__ && debugLogs) {
    console.log(message);
  }
}
