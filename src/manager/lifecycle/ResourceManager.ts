import { CancellablePromise } from "./CancelAbles";

type TypedEventListener<K extends keyof HTMLElementEventMap> = (this: HTMLElement, ev: HTMLElementEventMap[K]) => any;
type TypedDocumentEventListener<K extends keyof DocumentEventMap> = (this: Document, ev: DocumentEventMap[K]) => any;
type TypedWindowEventListener<K extends keyof WindowEventMap> = (this: Window, ev: WindowEventMap[K]) => any;

interface EventListenerEntry {
  element: EventTarget;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

class ResourceManager {
  private timers: number[] = [];
  private intervals: number[] = [];
  private eventListeners: EventListenerEntry[] = [];
  private promises: CancellablePromise<any>[] = [];
  private customEventListeners: (() => boolean)[] = [];

  /**
   * Registers a timer (e.g., setTimeout, setInterval) to be cleared later.
   */
  registerTimer(timerId: number) {
    this.timers.push(timerId);
  }

  /**
   * Registers an interval (setInterval) to be cleared later.
   */
  registerInterval(intervalId: number) {
    this.intervals.push(intervalId);
  }

  /**
   * Registers an event listener to be removed later.
   * @template K - The event type key
   * @template E - The element type
   */
  registerEventListener<K extends keyof HTMLElementEventMap, E extends HTMLElement>(
    element: E,
    type: K,
    listener: TypedEventListener<K>,
    options?: boolean | AddEventListenerOptions
  ): void;
  registerEventListener<K extends keyof DocumentEventMap>(
    element: Document,
    type: K,
    listener: TypedDocumentEventListener<K>,
    options?: boolean | AddEventListenerOptions
  ): void;
  registerEventListener<K extends keyof WindowEventMap>(
    element: Window,
    type: K,
    listener: TypedWindowEventListener<K>,
    options?: boolean | AddEventListenerOptions
  ): void;
  registerEventListener(
    element: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    element.addEventListener(type, listener, options);
    this.eventListeners.push({ element, type, listener, options });
  }

  /**
   * Registers a cancellable promise to be cancelled later.
   */
  registerCancellablePromise<T>(cancellablePromise: CancellablePromise<T>) {
    this.promises.push(cancellablePromise);
  }

  registerCustomEventListeners(customEventListenerRemover: () => boolean) {
    this.customEventListeners.push(customEventListenerRemover);
  }

  /**
   * Clears all the registered timers.
   */
  clearTimers() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  /**
   * Clears all the registered intervals.
   */
  clearIntervals() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }

  /**
   * Removes all the registered event listeners.
   */
  clearEventListeners() {
    this.eventListeners.forEach(({ element, type, listener, options }) => {
      element.removeEventListener(type, listener, options);
    });
    this.eventListeners = [];
  }

  /**
   * Cancels all the registered cancellable promises.
   */
  cancelAllPromises() {
    this.promises.forEach((cancellable) => cancellable.cancel());
    this.promises = [];
  }

  clearAllCustomEvents() {
    this.customEventListeners.forEach((customEventListenerRemover) => customEventListenerRemover());
    this.customEventListeners = [];
  }

  /**
   * Clears all resources (timers, event listeners, cancellable promises).
   */
  clearAll() {
    this.clearTimers();
    this.clearIntervals();
    this.clearEventListeners();
    this.cancelAllPromises();
    this.clearAllCustomEvents();
  }
}

const resourceManager = new ResourceManager();
export default resourceManager;
