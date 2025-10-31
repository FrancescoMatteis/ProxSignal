import { describe, it, expect } from "vitest";
import { Signal } from "../src";

describe("Signal Dirty Flag Management", () => {
	describe("Dirty Flag Lifecycle", () => {
		it("should mark dirty on value change", () => {
			const signal = new Signal(1);
			signal.v = 2;

			expect((signal as any)._isDirty).toBe(true);
		});

		it("should mark dirty on source change", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			signalB.v;

			expect((signalB as any)._isDirty).toBe(false);

			signalA.v = 2;

			expect((signalB as any)._isDirty).toBe(true);
		});

		it("should mark clean after getter access", () => {
			const signal = new Signal(1);
			signal.v = 2;

			expect((signal as any)._isDirty).toBe(true);

			signal.v;

			expect((signal as any)._isDirty).toBe(false);
		});

		it("should mark dirty on proxy notification", () => {
			const signal = new Signal({ count: 1 });
			signal.v.count = 2;

			expect((signal as any)._isDirty).toBe(true);
		});
	});

	describe("Caching Behavior", () => {
		it("should cache value when clean", () => {
			const signal = new Signal(1);
			const value1 = signal.v;
			const value2 = signal.v;

			expect(value1).toBe(value2);
			expect((signal as any)._isDirty).toBe(false);
		});

		it("should invalidate cache when dirty", () => {
			const signal = new Signal(1);
			signal.v;

			expect((signal as any)._isDirty).toBe(false);

			signal.v = 2;

			expect((signal as any)._isDirty).toBe(true);
			expect((signal as any)._cacheValue).toBe(1);
			expect(signal.v).toBe(2);
		});

		it("should re-compute cache when dirty", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			const value1 = signalB.v;
			expect(value1).toBe(2);

			signalA.v = 3;

			const value2 = signalB.v;
			expect(value2).toBe(6);
		});
	});

	describe("Optimization", () => {
		it("should avoid unnecessary re-computation", () => {
			let computeCount = 0;
			const signalA = new Signal(1);
			const signalB = new Signal(() => {
				computeCount++;
				return signalA.v * 2;
			});

			signalB.v;
			expect(computeCount).toBe(1);

			signalB.v;
			expect(computeCount).toBe(1);
		});

		it("should skip setter if value unchanged", () => {
			const signal = new Signal(1);
			const initialDirty = (signal as any)._isDirty;

			signal.v = 1;

			expect((signal as any)._isDirty).toBe(initialDirty);
		});

		it("should maintain dirty state through notifications", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);
			const signalC = new Signal<any>(() => signalB.v * 2);

			signalB.v;
			signalC.v;

			signalA.v = 2;

			expect((signalB as any)._isDirty).toBe(true);
			expect((signalC as any)._isDirty).toBe(true);
		});
	});
});
