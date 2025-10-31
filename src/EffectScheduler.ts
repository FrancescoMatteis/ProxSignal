/**
 * Schedules effect execution using microtasks.
 */
export class EffectScheduler {
	private static _instance: EffectScheduler;
	private _effects: Set<() => void> = new Set();
	private _launched: boolean = false;

	/**
	 * Creates a singleton instance of EffectScheduler.
	 */
	constructor() {
		if (EffectScheduler._instance) {
			return EffectScheduler._instance;
		}
		EffectScheduler._instance = this;
		return this;
	}

	/**
	 * Schedules an effect to be executed.
	 * @param effect - The effect function to schedule.
	 */
	scheduleEffect(effect: () => void): void {
		this._effects.add(effect);
	}

	/**
	 * Executes all scheduled effects using a microtask.
	 * Ensures effects are only executed once per batch.
	 */
	execute(): void {
		if (this._launched) {
			return;
		}
		this._launched = true;
		queueMicrotask(() => {
			for (const effect of this._effects) {
				effect();
			}
			this._effects.clear();
			this._launched = false;
		});
	}
}
