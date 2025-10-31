/**
 * Manages a stack of signals for dependency tracking.
 */
export class SignalStack {
	private static _instance: SignalStack;
	private _stack: any[] = [];

	/**
	 * Creates a singleton instance of SignalStack.
	 */
	constructor() {
		if (SignalStack._instance) {
			return SignalStack._instance;
		}
		SignalStack._instance = this;
		return this;
	}

	/**
	 * Pushes a signal onto the stack.
	 * @param signal - The signal to push.
	 */
	push(signal: any): void {
		this._stack.push(signal);
	}

	/**
	 * Pops a signal from the stack.
	 */
	pop(): void {
		this._stack.pop();
	}

	/**
	 * Checks if the stack is empty.
	 * @returns True if the stack is empty, false otherwise.
	 */
	isEmpty(): boolean {
		return this._stack.length === 0;
	}

	/**
	 * Gets the last signal in the stack.
	 * @returns The last signal in the stack.
	 */
	get last(): any {
		return this._stack[this._stack.length - 1];
	}
}
