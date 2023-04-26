function promisifyFsMethod<T extends (...args: unknown[]) => void>(fn: T) {
  return async <
    R extends ReturnType<T> extends Promise<unknown>
      ? ReturnType<T>
      : Promise<ReturnType<T>>
  >(
    ...args: Parameters<T>
  ): Promise<R> => {
    return await new Promise<R>((resolve, reject) => {
      fn(...args, (err: NodeJS.ErrnoException | null, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}
