import { describe, it, expect, beforeEach, vi } from "vitest";
import { Signal } from "../src";

describe("Signal Effects", () => {
	describe("Basic Effects", () => {
		it("should register effect callback", () => {
			const signal = new Signal(1);
			const effect = vi.fn();

			signal.onChange(effect);

			expect((signal as any)._effects.has(effect)).toBe(true);
		});

		it("should not execute effect immediately on registration", async () => {
			const signal = new Signal(1);
			const effect = vi.fn();

			signal.onChange(effect);

			expect(effect).toHaveBeenCalledTimes(0);

			signal.v = 2;

			// Wait for microtask
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effect).toHaveBeenCalledTimes(1);
		});

		it("should execute effect when signal changes", async () => {
			const signal = new Signal(1);
			const effect = vi.fn();

			signal.onChange(effect);

			// Change signal
			signal.v = 2;

			// Wait for effect execution
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effect).toHaveBeenCalledTimes(1);
		});

		it("should execute effect only once per change", async () => {
			const signal = new Signal(1);
			const effect = vi.fn();

			signal.onChange(effect);

			// Multiple rapid changes
			signal.v = 2;
			signal.v = 3;
			signal.v = 4;

			// Wait for effect
			await new Promise((resolve) => setTimeout(resolve, 0));

			// Should have been called: 1 (initial) + 1 (batched) = 2
			expect(effect).toHaveBeenCalledTimes(1);
		});

		it("should execute multiple effects for same signal", async () => {
			const signal = new Signal(1);
			const effect1 = vi.fn();
			const effect2 = vi.fn();
			const effect3 = vi.fn();

			signal.onChange(effect1);
			signal.onChange(effect2);
			signal.onChange(effect3);

			signal.v = 2;

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effect1).toHaveBeenCalledTimes(1);
			expect(effect2).toHaveBeenCalledTimes(1);
			expect(effect3).toHaveBeenCalledTimes(1);
		});
	});

	describe("Effect Timing", () => {
		it("should execute effects asynchronously (microtask)", async () => {
			const signal = new Signal(1);
			const callOrder: string[] = [];

			signal.onChange(() => {
				callOrder.push("effect");
			});

			callOrder.push("before");
			signal.v = 2;
			callOrder.push("after");

			// Before microtask, effect shouldn't be called
			expect(callOrder).toEqual(["before", "after"]);

			// Wait for microtask
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(callOrder).toEqual(["before", "after", "effect"]);
		});

		it("should batch multiple effect executions", async () => {
			const signal = new Signal(1);
			const effect = vi.fn();

			signal.onChange(effect);

			// Multiple changes
			signal.v = 2;
			signal.v = 3;
			signal.v = 4;

			// Should be batched into single microtask
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effect).toHaveBeenCalledTimes(1);
		});

		it("should maintain execution order", async () => {
			const signal = new Signal(1);
			const executionOrder: number[] = [];

			signal.onChange(() => executionOrder.push(1));
			signal.onChange(() => executionOrder.push(2));
			signal.onChange(() => executionOrder.push(3));

			signal.v = 2;

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(executionOrder).toEqual([1, 2, 3]);
		});
	});

	describe("Effect Cleanup", () => {
		it("should continue tracking effects after execution", async () => {
			const signal = new Signal(1);
			const effect = vi.fn();

			signal.onChange(effect);

			signal.v = 2;

			expect((signal as any)._effects.has(effect)).toBe(true);

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effect).toHaveBeenCalledTimes(1);
		});

		it("should handle effect that reads multiple signals", async () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const effect = vi.fn(() => {
				return signalA.v + signalB.v;
			});

			signalA.onChange(effect);

			// Change signalA
			signalA.v = 10;
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(effect).toHaveBeenCalledTimes(1);

			// Change signalB (doesn't trigger effect)
			signalB.v = 20;
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(effect).toHaveBeenCalledTimes(1);
		});

		it("should re-execute the effect when any computed dependency changes", async () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const effect = vi.fn();

			// Computed signal depends on both signalA and signalB
			const computed = new Signal(() => signalA.v + signalB.v);
			computed.onChange(effect);

			// Ensure the computed signal is accessed, so dependency tracking occurs
			computed.v; // Access triggers dependency registration

			// Trigger by changing signalA
			signalA.v = 42;
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(effect).toHaveBeenCalledTimes(1);

			// Trigger by changing signalB
			signalB.v = 100;
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(effect).toHaveBeenCalledTimes(2);
		});
	});

	describe("Effect Edge Cases", () => {
		it("should handle effect that modifies signal (potential infinite loop)", async () => {
			const signal = new Signal(1);
			let callCount = 0;

			signal.onChange(() => {
				callCount++;
				if (callCount < 3) {
					signal.v = signal.v + 1;
				}
			});

			signal.v = 2;

			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(callCount).toBeGreaterThan(0);
			expect(callCount).toBeLessThan(10); // Should not be infinite
		});

		it("should call effect 3 times when added to 3 signals and each one changes", async () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const signalC = new Signal(3);
			let callCount = 0;

			signalA.onChange(() => {
				callCount++;
			});
			signalB.onChange(() => {
				callCount++;
			});
			signalC.onChange(() => {
				callCount++;
			});

			signalA.v = 10;
			await new Promise((resolve) => setTimeout(resolve, 0));

			signalB.v = 20;
			await new Promise((resolve) => setTimeout(resolve, 0));

			signalC.v = 30;
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(callCount).toBe(3);
		});
	});
});
