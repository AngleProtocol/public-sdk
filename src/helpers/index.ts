const MAX_RETRIES = 10;
export async function withRetry<Args, T>(func: (...args: Args[]) => Promise<T>, args: Args[], maxRetries = MAX_RETRIES): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      const result = await func(...args);
      return result;
    } catch (error) {
      retries++;
      if (retries > maxRetries) {
        throw new Error(`Max retries exceeded when executing ${func.name.toLowerCase()}: ${error}`);
      }
    }
  }
}

export * from './feeManager';
export * from './ha';
export * from './slp';
export * from './spread';
export * from './user';
