const debugLogs = false;

export function debugLog(message: string): void {
  if (debugLogs) {
    console.log(message);
  }
}
