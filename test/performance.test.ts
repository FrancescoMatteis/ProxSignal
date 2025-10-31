import { describe, it, expect, vi } from "vitest";
import { Signal } from "../src";

describe("Signal Performance", () => {
	describe("Large Scale", () => {
		it("should handle 1000+ signals", () => {
			const signals: Signal<any>[] = [];
			for (let i = 0; i < 1000; i++) {
				signals.push(new Signal<any>(i));
			}

			for (let i = 0; i < 1000; i++) {
				expect(signals[i].v).toBe(i);
			}
		});

		it("should handle 1000+ computed signals", () => {
			const signals: Signal<any>[] = [];

			signals.push(new Signal<any>(0));
			for (let i = 1; i < 1000; i++) {
				signals.push(new Signal<any>(() => signals[i - 1].v + 1));
			}

			for (let i = 0; i < 1000; i++) {
				expect(signals[i].v).toBe(i);
			}
		});

		it("should handle complex dependency graphs", () => {
			const signals: Signal<any>[] = [new Signal<any>(1)];
			for (let i = 1; i < 100; i++) {
				if (i % 2 === 0) {
					signals.push(new Signal<any>(() => signals[i - 1].v * 2));
				} else {
					signals.push(new Signal<any>(() => signals[i - 1].v + 1));
				}
			}

			signals[0].v = 2;

			expect(signals[99].v).toBeGreaterThan(100);
		});
	});

	describe("Computed Signal Performance", () => {
		it("should cache expensive computations", () => {
			let computeCount = 0;
			const signalA = new Signal(1);
			const signalB = new Signal(() => {
				computeCount++;
				return signalA.v * 2;
			});

			signalB.v;
			signalB.v;
			signalB.v;

			expect(computeCount).toBe(1);
		});

		it("should re-compute only when necessary", () => {
			let computeCount = 0;
			const signalA = new Signal(1);
			const signalB = new Signal(() => {
				computeCount++;
				return signalA.v * 2;
			});

			signalB.v;
			expect(computeCount).toBe(1);

			signalA.v = 2;
			signalB.v;
			expect(computeCount).toBe(2);

			signalB.v;
			expect(computeCount).toBe(2);
		});

		it("should handle frequently changing values", () => {
			const signal = new Signal(1);

			for (let i = 0; i < 1000; i++) {
				signal.v = i;
			}

			expect(signal.v).toBe(999);
		});
	});

	describe("Speed", () => {
		it("chain of 2500 computed signals should be evaluated in 2ms", () => {
			const signals: Signal<any>[] = [];

			signals.push(new Signal<any>(1));

			for (let i = 1; i < 2500; i++) {
				signals.push(new Signal<any>(() => signals[i - 1].v + 1));
			}

			const startTime = Date.now();

			signals[2499].v;

			const endTime = Date.now();
			const duration = endTime - startTime;

			expect(signals[2499].v).toBe(2500);
			expect(duration).toBeLessThanOrEqual(2);
		});

		it("chain of 2500 computed signals with effect should be evaluated in 2ms", async () => {
			const signals: Signal<any>[] = [];

			const effects = vi.fn(() => {});

			signals.push(new Signal<any>(0));

			for (let i = 1; i < 2500; i++) {
				signals.push(new Signal<any>(() => signals[i - 1].v + 1));
				signals[i].onChange(effects);
			}

			const startTime = Date.now();

			signals[2499].v;

			const endTime = Date.now();
			const duration = endTime - startTime;

			expect(duration).toBeLessThanOrEqual(2);
		});
	});
});
