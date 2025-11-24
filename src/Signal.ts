import { creaProxy } from "./creaProxy.js";
import { SignalStack } from "./SignalStack.js";
import { NotificationScheduler } from "./NotificationScheduler.js";
import { EffectScheduler } from "./EffectScheduler.js";

/**
 * Reactive signal class with dependency tracking and change notifications.
 * @template T - The type of the signal value.
 */
export class Signal<T = any> {
	private _proxy: any;
	private _listeners: WeakRef<Signal<any>>[] = [];
	private _sources: WeakRef<Signal<any>>[] = [];
	private _effects: Set<() => void> = new Set();
	private _depth: number = 0;
	private _isDirty: boolean = true;
	private _cacheValue: T | null = null;

	/**
	 * Creates a new Signal instance with the given initial value.
	 * @param value - The initial value for the signal.
	 */
	constructor(value: T) {
		this._proxy = creaProxy({ v: value }, this.notify.bind(this));
		this.v;
	}

	/**
	 * Notifies that the signal value has changed.
	 * Marks the signal as dirty, removes all sources, and notifies listeners.
	 */
	private notify(): void {
		this._isDirty = true;
		this.removeAllSources();
		this.notifyListeners();
	}

	/**
	 * Checks if a listener exists in the listeners refs array.
	 */
	private _hasListener(listener: Signal<any>): boolean {
		return this._listeners.some((ref) => ref.deref() === listener);
	}

	/**
	 * Checks if a source exists in the sources refs array.
	 */
	private _hasSource(source: Signal<any>): boolean {
		return this._sources.some((ref) => ref.deref() === source);
	}

	/**
	 * Notifies all listener signals of changes and executes effects.
	 */
	private notifyListeners(): void {
		const scheduler = new NotificationScheduler();

		this._listeners = this._listeners.filter((ref) => {
			const listener = ref.deref();
			if (listener) {
				scheduler.scheduleSignal(listener);
				return true;
			}
			return false;
		});
		scheduler.execute();
		this.notifyEffects();
	}

	/**
	 * Notifies all registered effects of changes.
	 */
	private notifyEffects(): void {
		const scheduler = new EffectScheduler();
		for (const effect of this._effects) {
			scheduler.scheduleEffect(effect);
		}
		scheduler.execute();
	}

	/**
	 * Called when a source signal changes.
	 * Marks this signal as dirty and notifies listeners.
	 */
	sourceChanged(): void {
		this._isDirty = true;
		this.notifyListeners();
	}

	/**
	 * Adds a listener signal that will be notified when this signal changes.
	 * @param listener - The signal to notify when this signal changes.
	 */
	addListener(listener: Signal<any>): void {
		if (!this._hasListener(listener)) {
			this._listeners.push(new WeakRef(listener));
		}
	}

	/**
	 * Removes a listener signal.
	 * @param listener - The signal to stop notifying.
	 */
	removeListener(listener: Signal<any>): void {
		this._listeners = this._listeners.filter((ref) => ref.deref() !== listener);
	}

	/**
	 * Adds a source signal that this signal depends on.
	 * Updates the depth based on the source's depth.
	 * @param source - The source signal this signal depends on.
	 */
	addSource(source: Signal<any>): void {
		if (!this._hasSource(source)) {
			this._sources.push(new WeakRef(source));
		}
		this._depth = Math.max(this._depth, source._depth + 1);
	}

	/**
	 * Removes all source signals and resets the depth.
	 */
	removeAllSources(): void {
		for (const ref of this._sources) {
			const source = ref.deref();
			if (source) {
				source.removeListener(this);
			}
		}
		this._sources = [];
		this._depth = 0;
	}

	/**
	 * Registers an effect callback that will be called when the signal changes.
	 * @param callback - The callback function to execute when the signal changes.
	 */
	onChange(callback: () => void): void {
		this._effects.add(callback);
	}

	/**
	 * Gets the current value of the signal.
	 * If the signal is dirty, recomputes the value and tracks dependencies.
	 * @returns The current signal value.
	 */
	get v(): T {
		const stack = new SignalStack();
		if (this._isDirty) {
			if (typeof this._proxy.v === "function") {
				stack.push(this);
				this._cacheValue = this._proxy.v();
				stack.pop();
			} else {
				this._cacheValue = this._proxy.v;
			}
			this._isDirty = false;
		}

		if (!stack.isEmpty()) {
			const last = stack.last;
			this.addListener(last);
			last.addSource(this);
		}

		return this._cacheValue as T;
	}

	/**
	 * Sets the value of the signal.
	 * Triggers notifications if the value has changed.
	 * @param value - The new value for the signal.
	 */
	set v(value: T) {
		if (value === this._cacheValue) {
			return;
		}
		this._proxy.v = value;
	}
}
