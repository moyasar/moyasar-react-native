const isDebugLogsEnabled = false;

export function debugLog(message: string): void {
  if (__DEV__ && isDebugLogsEnabled) {
    console.debug(message);
  }
}

export function errorLog(message: string): void {
  if (__DEV__) {
    console.error(message);
  }
}
