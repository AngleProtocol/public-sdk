let isLoggerOn = true;

export function Logger(...args: any[]) {
  if (isLoggerOn) {
    console.log(...args);
  }
}

export const setLoggerOn = () => (isLoggerOn = true);
export const setLoggerOff = () => (isLoggerOn = false);
