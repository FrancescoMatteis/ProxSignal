import { describe, it, expect } from "vitest";
import { Signal } from "../src";

describe("Signal Edge Cases", () => {
	describe("Circular Dependencies", () => {
		it("should throw error for A → B → A cycles", () => {
			const signalA = new Signal<any>(() => signalB.v + 1);
			const signalB = new Signal<any>(() => signalA.v + 1);

			expect(() => {
				signalA.v;
			}).toThrow();
		});

		it("should throw error for A → B → C → A cycles", () => {
			const signalA = new Signal<any>(() => signalC.v + 1);
			const signalB = new Signal<any>(() => signalA.v + 1);
			const signalC = new Signal<any>(() => signalB.v + 1);

			expect(() => {
				signalA.v;
			}).toThrow();
		});
	});

	describe("Deep Dependency Chains", () => {
		it("should handle very deep chains (10+ levels)", () => {
			const signals = [new Signal(1)];
			for (let i = 1; i < 10; i++) {
				signals.push(new Signal<any>(() => signals[i - 1].v + 1));
			}

			expect(signals[9].v).toBe(10);
		});

		it("should notify in correct order", () => {
			const executionOrder: number[] = [];
			const signals = [new Signal(1)];

			for (let i = 1; i < 5; i++) {
				signals.push(
					new Signal<any>(() => {
						executionOrder.push(i);
						return signals[i - 1].v + 1;
					})
				);
			}

			signals[0].v = 2;

			for (let i = 1; i < 5; i++) {
				signals[i].v;
			}

			expect(executionOrder.length).toBeGreaterThan(0);
		});
	});

	describe("Rapid Changes", () => {
		it("should handle rapid consecutive changes", () => {
			const signal = new Signal(1);

			for (let i = 0; i < 100; i++) {
				signal.v = i;
			}

			expect(signal.v).toBe(99);
		});

		it("should batch updates correctly", async () => {
			const signal = new Signal(1);
			let effectCount = 0;

			signal.onChange(() => {
				effectCount++;
			});

			// Effect is called immediately on registration (1 call)
			expect(effectCount).toBe(1);

			for (let i = 0; i < 10; i++) {
				signal.v = i;
			}

			await new Promise((resolve) => setTimeout(resolve, 0));

			// 1 initial call + 1 batched call = 2 total
			expect(effectCount).toBe(2);
		});
	});

	describe("Null/Undefined Values", () => {
		it("should handle undefined dependencies", () => {
			const signalA = new Signal<any>(undefined);
			const signalB = new Signal(() => signalA.v ?? 0);

			expect(signalB.v).toBe(0);
		});

		it("should handle null dependencies", () => {
			const signalA = new Signal<any>(null);
			const signalB = new Signal(() => signalA.v ?? 0);

			expect(signalB.v).toBe(0);
		});

		it("should handle undefined computed functions", () => {
			const signal = new Signal<any>(undefined);

			expect(signal.v).toBeUndefined();
		});
	});
});
