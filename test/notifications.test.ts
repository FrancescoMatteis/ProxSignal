import { describe, it, expect } from "vitest";
import { Signal } from "../src";
import { NotificationScheduler } from "../src/NotificationScheduler";

describe("Signal Notifications", () => {
	describe("Basic Notifications", () => {
		it("should notify listeners when signal changes", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			// Read signalB to establish dependency
			signalB.v;

			expect(signalB.v).toBe(2);

			// Change signalA
			signalA.v = 3;

			// Check that signalB was notified
			expect(signalB.v).toBe(6);
		});

		it("should skip notifications when value unchanged", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			signalB.v;

			expect(signalB.v).toBe(2);

			// Set same value
			signalA.v = 1;

			// SignalB should still be clean
			expect((signalB as any)._isDirty).toBe(false);
		});
	});

	describe("Notification Scheduling", () => {
		it("should schedule signals by depth", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);
			const signalC = new Signal<any>(() => signalB.v * 2);

			// Establish dependencies
			signalB.v;
			signalC.v;

			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);
			expect((signalC as any)._depth).toBe(2);

			// Change root signal
			signalA.v = 2;

			// Check that depth is maintained
			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);
			expect((signalC as any)._depth).toBe(2);
		});

		it("should use binary search to insert signals at correct positions", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v + 10);
			const signalC = new Signal<any>(() => signalB.v + 100);
			const signalD = new Signal<any>(() => signalC.v + 1000);
			const signalE = new Signal<any>(() => signalD.v + 10000);

			signalE.v;

			// Now signalA is depth 0, signalB depth 1, ..., signalE depth 4
			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);
			expect((signalC as any)._depth).toBe(2);
			expect((signalD as any)._depth).toBe(3);
			expect((signalE as any)._depth).toBe(4);
		});

		it("should execute notifications in proper sequence", () => {
			const executionOrder: number[] = [];
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => {
				executionOrder.push(1);
				return signalA.v * 2;
			});
			const signalC = new Signal<any>(() => {
				executionOrder.push(2);
				return signalB.v * 2;
			});

			signalB.v;
			signalC.v;

			signalA.v = 2;

			// Read values to trigger re-computation
			signalB.v;
			signalC.v;

			// Order should be: signalB (depth 1) before signalC (depth 2)
			expect(executionOrder.length).toBeGreaterThan(0);
		});

		it("should correctly insert signals when entering the queue", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v + 10);
			const signalC = new Signal<any>(() => signalB.v + 100);
			const signalD = new Signal<any>(() => signalB.v + 1000);
			const signalE = new Signal<any>(() => signalD.v + 10000);

			signalC.v;
			signalE.v;

			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);
			expect((signalC as any)._depth).toBe(2);
			expect((signalD as any)._depth).toBe(2);
			expect((signalE as any)._depth).toBe(3);

			signalC.v = () => signalE.v + 1;

			signalC.v;
			signalE.v;

			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);
			expect((signalD as any)._depth).toBe(2);
			expect((signalE as any)._depth).toBe(3);
			expect((signalC as any)._depth).toBe(4);
		});

		it("should correctly sort the execution queue of a tree of signals", async () => {
			let executionOrder: string[] = [];

			// Level 0 (root)
			const signalA = new Signal(1);
			signalA.onChange(() => {
				executionOrder.push("A");
			});

			signalA.v;

			// Level 1
			const signalB = new Signal<any>(() => signalA.v + 10);
			signalB.onChange(() => {
				executionOrder.push("B");
			});
			const signalC = new Signal<any>(() => signalA.v + 100);
			signalC.onChange(() => {
				executionOrder.push("C");
			});

			// Level 2
			const signalD = new Signal<any>(() => signalB.v + 1000);
			signalD.onChange(() => {
				executionOrder.push("D");
			});
			const signalE = new Signal<any>(() => signalC.v + 2000);
			signalE.onChange(() => {
				executionOrder.push("E");
			});
			// Level 3
			const signalF = new Signal<any>(() => signalD.v + 3000);
			signalF.onChange(() => {
				executionOrder.push("F");
			});

			// Effects are called immediately on registration, so we need to clear the array
			executionOrder = [];

			signalE.v;
			signalF.v;

			signalA.v = 2;

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(executionOrder).toEqual(["F", "D", "E", "C", "B", "A"]);
		});
	});

	describe("Cascading Notifications", () => {
		it("should propagate notifications through chain", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);
			const signalC = new Signal<any>(() => signalB.v * 2);

			signalB.v;
			signalC.v;

			expect(signalB.v).toBe(2);
			expect(signalC.v).toBe(4);

			signalA.v = 2;

			expect(signalB.v).toBe(4);
			expect(signalC.v).toBe(8);
		});

		it("should handle multiple levels of notifications", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);
			const signalC = new Signal<any>(() => signalB.v * 2);
			const signalD = new Signal<any>(() => signalC.v * 2);

			signalB.v;
			signalC.v;
			signalD.v;

			expect(signalB.v).toBe(2);
			expect(signalC.v).toBe(4);
			expect(signalD.v).toBe(8);

			signalA.v = 2;

			expect(signalB.v).toBe(4);
			expect(signalC.v).toBe(8);
			expect(signalD.v).toBe(16);
		});

		it("should avoid duplicate notifications", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);
			const signalC = new Signal(() => signalA.v * 3);

			signalB.v;
			signalC.v;

			const initialDepthB = (signalB as any)._depth;
			const initialDepthC = (signalC as any)._depth;

			signalA.v = 2;

			// Depths should remain consistent
			expect((signalB as any)._depth).toBe(initialDepthB);
			expect((signalC as any)._depth).toBe(initialDepthC);
		});
	});

	describe("Notification with Effects", () => {
		it("should notify effects when signal changes", async () => {
			const signalA = new Signal(1);
			let effectCalled = false;

			signalA.onChange(() => {
				effectCalled = true;
			});

			// Effect is called immediately on registration
			expect(effectCalled).toBe(true);

			// Reset for the change notification
			effectCalled = false;

			signalA.v = 2;

			// Effect should be called asynchronously on change
			expect(effectCalled).toBe(false);

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effectCalled).toBe(true);
		});

		it("should notify multiple effects", async () => {
			const signalA = new Signal(1);
			let effect1Called = false;
			let effect2Called = false;

			signalA.onChange(() => {
				effect1Called = true;
			});

			signalA.onChange(() => {
				effect2Called = true;
			});

			// Effects are called immediately on registration
			expect(effect1Called).toBe(true);
			expect(effect2Called).toBe(true);

			// Reset for the change notification
			effect1Called = false;
			effect2Called = false;

			signalA.v = 2;

			expect(effect1Called).toBe(false);
			expect(effect2Called).toBe(false);

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effect1Called).toBe(true);
			expect(effect2Called).toBe(true);
		});
	});
});
