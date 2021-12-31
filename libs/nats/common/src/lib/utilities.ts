export class PromiseTimeoutError extends Error {
  constructor(timeout: number) {
    super(`Promise failed to complete before a duration of ${timeout}`);
  }
}

export const promiseWithTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
  let timer: ReturnType<typeof setTimeout>;
  return (
    Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(reject, timeout, new PromiseTimeoutError(timeout));
      }),
    ]) as Promise<T>
  ).finally(() => clearTimeout(timer));
};
