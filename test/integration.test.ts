import { describe, it, expect } from "vitest";
import { Signal, SignalStack, NotificationScheduler, EffectScheduler } from "../src";

describe("Signal Integration", () => {
	describe("SignalStack Integration", () => {
		it("should push to stack when computing", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			const stack = new SignalStack();
			expect(stack.isEmpty()).toBe(true);

			signalB.v;

			// After computation, stack should be empty
			expect(stack.isEmpty()).toBe(true);
		});

		it("should pop from stack after computing", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			const stack = new SignalStack();
			signalB.v;

			expect(stack.isEmpty()).toBe(true);
		});

		it("should maintain singleton instance", () => {
			const stack1 = new SignalStack();
			const stack2 = new SignalStack();

			expect(stack1).toBe(stack2);
		});

		it("should handle empty stack check", () => {
			const stack = new SignalStack();
			expect(stack.isEmpty()).toBe(true);
		});

		it("should track dependency when stack is not empty", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			signalB.v;

			expect((signalB as any)._sources.has(signalA)).toBe(true);
			expect((signalA as any)._listeners.has(signalB)).toBe(true);
		});
	});

	describe("NotificationScheduler Integration", () => {
		it("should schedule signals correctly", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			signalB.v;

			const scheduler = new NotificationScheduler();
			scheduler.scheduleSignal(signalB);

			// Schedule should not throw
			expect(() => scheduler.execute()).not.toThrow();
		});

		it("should execute in depth order", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);
			const signalC = new Signal<any>(() => signalB.v * 2);

			signalB.v;
			signalC.v;

			(signalB as any)._depth = 1;
			(signalC as any)._depth = 2;

			const scheduler = new NotificationScheduler();
			scheduler.scheduleSignal(signalC);
			scheduler.scheduleSignal(signalB);

			// Should execute signalB first (lower depth)
			scheduler.execute();

			expect(signalB.v).toBe(2);
		});

		it("should maintain singleton instance", () => {
			const scheduler1 = new NotificationScheduler();
			const scheduler2 = new NotificationScheduler();

			expect(scheduler1).toBe(scheduler2);
		});
	});

	describe("EffectScheduler Integration", () => {
		it("should schedule effects correctly", async () => {
			const scheduler = new EffectScheduler();

			let count = 0;

			scheduler.scheduleEffect(() => {
				count++;
			});

			scheduler.execute();

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(count).toBe(1);
		});

		it("should batch multiple effects", async () => {
			const scheduler = new EffectScheduler();
			let effect1Called = false;
			let effect2Called = false;

			scheduler.scheduleEffect(() => {
				effect1Called = true;
			});

			scheduler.scheduleEffect(() => {
				effect2Called = true;
			});

			scheduler.execute();

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effect1Called).toBe(true);
			expect(effect2Called).toBe(true);
		});

		it("should maintain singleton instance", () => {
			const scheduler1 = new EffectScheduler();
			const scheduler2 = new EffectScheduler();

			expect(scheduler1).toBe(scheduler2);
		});
	});
});
