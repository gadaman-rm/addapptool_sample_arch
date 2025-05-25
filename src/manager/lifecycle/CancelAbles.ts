import resourceManager from "./ResourceManager";

export type CancellableTimer = {
  clear: () => void;
};

export function createCancellableTimer(callback: () => void, delay: number): CancellableTimer {
  const timerId = setTimeout(callback, delay);

  // Automatically register the timer in the ResourceManager
  resourceManager.registerTimer(Number(timerId));

  return {
    clear: () => clearTimeout(timerId),
  };
}

export type CancellableEventListener = {
  remove: () => void;
};

export type CancellableInterval = {
  clear: () => void;
};

export function createCancellableInterval(callback: () => void, interval: number): CancellableInterval {
  const intervalId = setInterval(callback, interval);

  // Automatically register the interval in the ResourceManager
  resourceManager.registerInterval(Number(intervalId));

  return {
    clear: () => clearInterval(intervalId),
  };
}

export function createCancellableEventListener(
  element: EventTarget,
  eventType: string,
  listener: EventListenerOrEventListenerObject
): CancellableEventListener {
  element.addEventListener(eventType, listener);

  // Automatically register the event listener in the ResourceManager
  (resourceManager as any).registerEventListener(element, eventType, listener);

  return {
    remove: () => element.removeEventListener(eventType, listener),
  };
}

export type CancellablePromise<T> = {
  promise: Promise<T>;
  cancel: () => void;
};

export function createCancellablePromise<T>(
  executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void
): CancellablePromise<T> {
  let cancel: () => void = () => {
    throw new Error("cancel function not defined!");
  };

  const promise = new Promise<T>((resolve, reject) => {
    cancel = () => {
      reject("Promise was cancelled");
    };
    executor(resolve, reject);
  });

  // Automatically register the cancellable promise in the ResourceManager
  const cancellablePromise: CancellablePromise<T> = { promise, cancel };
  resourceManager.registerCancellablePromise(cancellablePromise);

  return cancellablePromise;
}
