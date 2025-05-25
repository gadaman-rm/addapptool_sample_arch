export type EventCallback = (data: any) => void;

interface Listener {
  id: number;
  callback: EventCallback;
}

export class EventEmitter<T extends string> {
  private events: { [key: string]: Listener[] } = {};
  private nextId: number = 1;

  on(event: T, callback: EventCallback): () => boolean {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    const id = this.nextId++;
    this.events[event].push({ id, callback });
    return () => this.remove(event, id); // Return the unique ID for this listener
  }

  remove(event: T, id: number): boolean {
    if (!this.events[event]) return false;
    const initialLength = this.events[event].length;
    this.events[event] = this.events[event].filter((listener) => listener.id !== id);
    return this.events[event].length < initialLength;
  }

  emit(event: T, data?: unknown) {
    if (this.events[event]) {
      this.events[event].forEach(({ callback }) => callback(data));
    }
  }
}
