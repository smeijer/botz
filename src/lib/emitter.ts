type EventType = string | symbol;

type Handler<T = unknown> = (event: T) => void;
type EventHandlerList<Events> = Array<Handler<Events[keyof Events]>>;
export type EventHandler<Events, Key extends keyof Events> = (
  event: Events[Key]
) => void;

export class Emitter<Events extends Record<EventType, unknown>> {
  /**
   * A Map of event names to registered handler functions.
   */
  all = new Map<keyof Events, EventHandlerList<Events>>();

  /**
   * Register an event handler for the given type.
   * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
   * @param {Function} handler Function to call in response to given event
   */
  on<Key extends keyof Events>(type: Key, handler: EventHandler<Events, Key>) {
    const handlers = this.all.get(type);

    if (handlers) {
      handlers.push(handler as any);
    } else {
      this.all.set(type, [handler] as EventHandlerList<Events>);
    }
  }

  /**
   * Register an event handler for given type, to run once
   * @param {string|symbol} type Type for the event to listen for
   * @param {Function} handler Function to call in response to given event
   */
  once<Key extends keyof Events>(
    type: Key,
    handler: EventHandler<Events, Key>
  ) {
    this.on(type, handler as any);
    this.on(type, () => this.off(type, handler));
  }

  /**
   * Remove an event handler for the given type.
   * If `handler` is omitted, all handlers of the given type are removed.
   * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
   * @param {Function} [handler] Handler function to remove
   */
  off<Key extends keyof Events>(
    type: Key,
    handler?: EventHandler<Events, Key>
  ) {
    const handlers = this.all.get(type);
    if (!handlers) return;

    if (handler) {
      handlers.splice(handlers.indexOf(handler as any) >>> 0, 1);
    } else {
      this.all.set(type, []);
    }
  }

  /**
   * Invoke all handlers for the given type.
   *
   * @param {string|symbol} type The event type to invoke
   * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
   */
  emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
    this.all.get(type)?.forEach((handler) => handler(evt!));
  }
}
