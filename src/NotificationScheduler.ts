/**
 * Schedules signal notifications with depth-based ordering.
 */
export class NotificationScheduler {
	private static _instance: NotificationScheduler;
	private _signalsQueue: any[] = [];
	private _queuedSignals: Set<any> = new Set();

	/**
	 * Creates a singleton instance of NotificationScheduler.
	 */
	constructor() {
		if (NotificationScheduler._instance) {
			return NotificationScheduler._instance;
		}
		NotificationScheduler._instance = this;
		return this;
	}

	/**
	 * Finds the insertion position for a signal using binary search to maintain sorted order by depth.
	 * @param signal - The signal to find the insertion position for.
	 * @returns The index where the signal should be inserted.
	 */
	private _findInsertionPosition(signal: any): number {
		const targetDepth = signal._depth;
		let left = 0;
		let right = this._signalsQueue.length;

		while (left < right) {
			const mid = Math.floor((left + right) / 2);
			const midDepth = this._signalsQueue[mid]._depth;

			if (midDepth < targetDepth) {
				left = mid + 1;
			} else {
				right = mid;
			}
		}
		return left;
	}

	/**
	 * Schedules a signal for notification, inserting it at the correct position to maintain sorted order.
	 * @param signal - The signal to schedule.
	 */
	scheduleSignal(signal: any): void {
		if (this._queuedSignals.has(signal)) {
			return;
		}
		const insertIndex = this._findInsertionPosition(signal);
		this._signalsQueue.splice(insertIndex, 0, signal);
		this._queuedSignals.add(signal);
	}

	/**
	 * Executes the next signal notification from the queue.
	 * Since the queue is sorted by depth, this processes signals in the correct order.
	 */
	execute(): void {
		if (this._signalsQueue.length > 0) {
			const signal = this._signalsQueue.shift();
			this._queuedSignals.delete(signal);
			signal.sourceChanged();
		}
	}
}
