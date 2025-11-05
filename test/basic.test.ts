import { describe, it, expect, beforeEach } from "vitest";
import { Signal } from "../src";

describe("Signal Basic Behavior", () => {
	describe("Initialization", () => {
		it("should create signal with initial value", () => {
			const signal = new Signal(42);
			expect(signal.v).toBe(42);
		});

		it("should cache initial value", () => {
			const signal = new Signal("hello");
			const value1 = signal.v;
			const value2 = signal.v;
			expect(value1).toBe(value2);
			expect(value1).toBe("hello");
		});

		it("should NOT be dirty initially", () => {
			const signal = new Signal(100);
			expect((signal as any)._isDirty).toBe(false);
		});

		it("should have empty listeners set", () => {
			const signal = new Signal(1);
			expect((signal as any)._listeners.size).toBe(0);
		});

		it("should have empty sources set", () => {
			const signal = new Signal(1);
			expect((signal as any)._sources.size).toBe(0);
		});

		it("should have empty effects set", () => {
			const signal = new Signal(1);
			expect((signal as any)._effects.size).toBe(0);
		});

		it("should have depth 0 initially", () => {
			const signal = new Signal(1);
			expect((signal as any)._depth).toBe(0);
		});
	});

	describe("Getter Behavior", () => {
		it("should return cached value when clean", () => {
			const signal = new Signal(5);
			expect((signal as any)._cacheValue).toBe(5);
			const firstRead = signal.v;
			expect((signal as any)._cacheValue).toBe(5);
			const secondRead = signal.v;
			expect(firstRead).toBe(secondRead);
			expect((signal as any)._isDirty).toBe(false);
		});

		it("should not trigger notification when reading clean value", () => {
			const signal = new Signal(10);
			const listenersBefore = (signal as any)._listeners.size;
			signal.v; // Read
			const listenersAfter = (signal as any)._listeners.size;
			expect(listenersAfter).toBe(listenersBefore);
		});

		it("should compute value when dirty", () => {
			const signal = new Signal(3);
			signal.v = 7; // Mark as dirty
			expect((signal as any)._isDirty).toBe(true);
			const value = signal.v; // Should compute
			expect(value).toBe(7);
			expect((signal as any)._isDirty).toBe(false);
		});

		it("should mark as clean after getter access", () => {
			const signal = new Signal(1);
			signal.v = 2;
			expect((signal as any)._isDirty).toBe(true);
			signal.v; // Access getter
			expect((signal as any)._isDirty).toBe(false);
		});

		it("should handle primitive values", () => {
			const numSignal = new Signal(42);
			expect(numSignal.v).toBe(42);

			const strSignal = new Signal("test");
			expect(strSignal.v).toBe("test");

			const boolSignal = new Signal(true);
			expect(boolSignal.v).toBe(true);
		});

		it("should handle object values", () => {
			const obj = { a: 1, b: 2 };
			const signal = new Signal(obj);
			expect(signal.v).toStrictEqual(obj);
			expect(signal.v.a).toBe(1);
			expect(signal.v.b).toBe(2);
		});

		it("should handle function values (computed)", () => {
			const computeFn = () => 42;
			const signal = new Signal(computeFn);
			const result = signal.v;
			expect(result).toBe(42);
		});
	});

	describe("Setter Behavior", () => {
		it("should set new value", () => {
			const signal = new Signal(1);
			signal.v = 99;
			expect(signal.v).toBe(99);
		});

		it("should mark as dirty when value changes", () => {
			const signal = new Signal(1);
			signal.v = 2;
			expect((signal as any)._isDirty).toBe(true);
		});

		it("should NOT mark as dirty when value is same (primitive equality)", () => {
			const signal = new Signal(5);
			signal.v; // Access to cache the value
			signal.v = 5; // Same value
			expect((signal as any)._isDirty).toBe(false);
		});

		it("should trigger notification to listeners", () => {
			const signal1 = new Signal(1);
			const signal2 = new Signal(() => signal1.v * 2);

			// Change signal1 and verify signal2 gets notified
			signal1.v = 2;
			expect((signal2 as any)._isDirty).toBe(true);
			expect(signal2.v).toBe(4);
		});

		it("should trigger effects", async () => {
			const signal = new Signal(1);
			let effectCalled = false;

			signal.onChange(() => {
				effectCalled = true;
			});

			signal.v = 2;

			// Wait for microtask to complete
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(effectCalled).toBe(true);
		});
	});
});
