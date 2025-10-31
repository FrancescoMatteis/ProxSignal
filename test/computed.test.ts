import { describe, it, expect } from "vitest";
import { Signal } from "../src";

describe("Signal Computed Behavior", () => {
	describe("Basic Computed", () => {
		it("should create computed signal from function", () => {
			const signal = new Signal<any>(() => 42);
			expect(signal.v).toBe(42);
		});

		it("should cache computed result", () => {
			let callCount = 0;
			const signal = new Signal<any>(() => {
				callCount++;
				return 100;
			});

			const value1 = signal.v;
			const value2 = signal.v;
			const value3 = signal.v;

			expect(value1).toBe(100);
			expect(value2).toBe(100);
			expect(value3).toBe(100);
			expect(callCount).toBe(1); // Function called only once
		});

		it("should re-compute when dependencies change", () => {
			const sourceSignal = new Signal(5);
			const computedSignal = new Signal<any>(() => sourceSignal.v * 2);

			expect(computedSignal.v).toBe(10);

			sourceSignal.v = 7;
			expect(computedSignal.v).toBe(14);
		});

		it("should maintain cache until dirty", () => {
			let callCount = 0;
			const signal = new Signal<any>(() => {
				callCount++;
				return callCount;
			});

			const firstAccess = signal.v;
			const secondAccess = signal.v;
			const thirdAccess = signal.v;

			expect(firstAccess).toBe(1);
			expect(secondAccess).toBe(1);
			expect(thirdAccess).toBe(1);
			expect(callCount).toBe(1);
		});
	});

	describe("Computed with Primitives", () => {
		it("should compute sum of two number signals", () => {
			const signalA = new Signal(3);
			const signalB = new Signal(5);
			const sumSignal = new Signal<any>(() => signalA.v + signalB.v);

			expect(sumSignal.v).toBe(8);

			signalA.v = 10;
			expect(sumSignal.v).toBe(15);

			signalB.v = 20;
			expect(sumSignal.v).toBe(30);
		});

		it("should compute concatenation of two string signals", () => {
			const signalA = new Signal("Hello");
			const signalB = new Signal("World");
			const concatSignal = new Signal<any>(() => signalA.v + " " + signalB.v);

			expect(concatSignal.v).toBe("Hello World");

			signalA.v = "Hi";
			expect(concatSignal.v).toBe("Hi World");
		});

		it("should compute boolean operations", () => {
			const signalA = new Signal(true);
			const signalB = new Signal(false);
			const andSignal = new Signal<any>(() => signalA.v && signalB.v);
			const orSignal = new Signal<any>(() => signalA.v || signalB.v);

			expect(andSignal.v).toBe(false);
			expect(orSignal.v).toBe(true);

			signalB.v = true;
			expect(andSignal.v).toBe(true);
			expect(orSignal.v).toBe(true);
		});
	});

	describe("Computed with Objects", () => {
		it("should compute object properties", () => {
			const objSignal = new Signal({ x: 10, y: 20 });
			const xSignal = new Signal<any>(() => objSignal.v.x);
			const ySignal = new Signal<any>(() => objSignal.v.y);

			expect(xSignal.v).toBe(10);
			expect(ySignal.v).toBe(20);

			objSignal.v = { x: 30, y: 40 };
			expect(xSignal.v).toBe(30);
			expect(ySignal.v).toBe(40);
		});

		it("should compute nested object access", () => {
			const objSignal = new Signal({
				user: {
					name: "John",
					age: 30,
				},
			});
			const nameSignal = new Signal<any>(() => objSignal.v.user.name);
			const ageSignal = new Signal<any>(() => objSignal.v.user.age);

			expect(nameSignal.v).toBe("John");
			expect(ageSignal.v).toBe(30);

			objSignal.v = {
				user: {
					name: "Jane",
					age: 25,
				},
			};
			expect((nameSignal as any)._isDirty).toBe(true);
			expect((ageSignal as any)._isDirty).toBe(true);
			expect(nameSignal.v).toBe("Jane");
			expect(ageSignal.v).toBe(25);
		});

		it("should compute array operations", () => {
			const arraySignal = new Signal([1, 2, 3]);
			const lengthSignal = new Signal<any>(() => arraySignal.v.length);
			const sumSignal = new Signal<any>(() => arraySignal.v.reduce((a, b) => a + b, 0));

			expect(lengthSignal.v).toBe(3);
			expect(sumSignal.v).toBe(6);

			arraySignal.v = [4, 5, 6, 7];
			expect((lengthSignal as any)._isDirty).toBe(true);
			expect((sumSignal as any)._isDirty).toBe(true);
			expect(lengthSignal.v).toBe(4);
			expect(sumSignal.v).toBe(22);
		});
	});

	describe("Computed Signal Depth", () => {
		it("should track depth in computed signals", () => {
			const sourceSignal = new Signal(1);
			const computedSignal = new Signal<any>(() => sourceSignal.v * 2);

			computedSignal.v;

			expect((sourceSignal as any)._depth).toBe(0);
			expect((computedSignal as any)._depth).toBe(1);
		});

		it("should have correct depth with multiple levels", () => {
			const level0 = new Signal(1);
			const level1 = new Signal<any>(() => level0.v * 2);
			const level2 = new Signal<any>(() => level1.v * 2);
			const level3 = new Signal<any>(() => level2.v * 2);

			level1.v;
			level2.v;
			level3.v;

			expect((level0 as any)._depth).toBe(0);
			expect((level1 as any)._depth).toBe(1);
			expect((level2 as any)._depth).toBe(2);
			expect((level3 as any)._depth).toBe(3);
		});

		it("should update depth correctly when computed signal changes", () => {
			const computed1 = new Signal<any>(1);
			const computed2 = new Signal<any>(() => computed1.v * 2);

			computed2.v;
			expect((computed2 as any)._depth).toBe(1);

			// Change to non-computed value
			computed2.v = 100;
			expect((computed2 as any)._depth).toBe(0);

			computed1.v = () => computed2.v * 3;
			computed1.v;
			expect((computed2 as any)._depth).toBe(0);
			expect((computed1 as any)._depth).toBe(1);
		});
	});
});
