import { describe, it, expect } from "vitest";
import { Signal } from "../src";

describe("Signal Dependency Tracking", () => {
	describe("Basic Dependency", () => {
		it("should track when reading signal B from signal A's getter", () => {
			const signalA = new Signal(5);
			const signalB = new Signal(() => signalA.v * 2);

			// Access signalB to create dependency
			signalB.v;

			// Verify dependency relationship
			expect((signalA as any)._listeners.has(signalB)).toBe(true);
			expect((signalB as any)._sources.has(signalA)).toBe(true);
		});

		it("should add B as listener of A", () => {
			const signalA = new Signal(10);
			const signalB = new Signal(() => signalA.v + 1);

			signalB.v;

			expect((signalA as any)._listeners.has(signalB)).toBe(true);
			expect((signalA as any)._listeners.size).toBe(1);
		});

		it("should add A as source of B", () => {
			const signalA = new Signal(7);
			const signalB = new Signal(() => signalA.v - 2);

			signalB.v;

			expect((signalB as any)._sources.has(signalA)).toBe(true);
			expect((signalB as any)._sources.size).toBe(1);
		});

		it("should update depth when signals depend on each other", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(() => signalA.v * 2);

			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);

			signalB.v;

			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);
		});

		it("should maintain dependency graph correctly", () => {
			const signalA = new Signal(2);
			const signalB = new Signal<any>(() => signalA.v + 1);
			const signalC = new Signal<any>(() => (signalB.v as number) * 2);

			// Access B first to establish A -> B dependency
			signalB.v;
			// Then access C to establish B -> C dependency
			signalC.v;

			// C depends on B
			expect((signalB as any)._listeners.has(signalC)).toBe(true);
			expect((signalC as any)._sources.has(signalB)).toBe(true);

			// B depends on A
			expect((signalA as any)._listeners.has(signalB)).toBe(true);
			expect((signalB as any)._sources.has(signalA)).toBe(true);

			// Depth chain: A(0) -> B(1) -> C(2)
			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);
			expect((signalC as any)._depth).toBe(2);
		});
	});

	describe("Multiple Dependencies", () => {
		it("should track multiple sources in one signal", () => {
			const signalA = new Signal(3);
			const signalB = new Signal(5);
			const signalC = new Signal(() => signalA.v + signalB.v);

			signalC.v;

			expect((signalC as any)._sources.size).toBe(2);
			expect((signalC as any)._sources.has(signalA)).toBe(true);
			expect((signalC as any)._sources.has(signalB)).toBe(true);
		});

		it("should have correct depth with multiple dependencies", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const signalC = new Signal(() => signalA.v + signalB.v);

			signalC.v;

			// All source signals at depth 0
			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(0);

			// signalC depends on A and B, should have depth 1
			expect((signalC as any)._depth).toBe(1);
		});

		it("should handle dependency chain (A → B → C)", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);
			const signalC = new Signal<any>(() => signalB.v + 5);

			// Access B first to establish A -> B dependency
			signalB.v;
			// Then access C to establish B -> C dependency
			signalC.v;

			// Verify the chain
			expect((signalA as any)._listeners.has(signalB)).toBe(true);
			expect((signalB as any)._listeners.has(signalC)).toBe(true);

			expect((signalB as any)._sources.has(signalA)).toBe(true);
			expect((signalC as any)._sources.has(signalB)).toBe(true);

			// Verify depths
			expect((signalA as any)._depth).toBe(0);
			expect((signalB as any)._depth).toBe(1);
			expect((signalC as any)._depth).toBe(2);
		});
	});

	describe("Dependency Cleanup", () => {
		it("should remove sources when signal changes", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);

			signalB.v;
			expect((signalB as any)._sources.size).toBe(1);

			// Change signalB's value
			signalB.v = 100;

			// Sources should be cleared
			expect((signalB as any)._sources.size).toBe(0);
		});

		it("should notify sources to remove listener", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);

			signalB.v;
			expect((signalA as any)._listeners.has(signalB)).toBe(true);

			// Change signalB's value
			signalB.v = 100;

			// signalA should no longer have signalB as listener
			expect((signalA as any)._listeners.has(signalB)).toBe(false);
		});

		it("should clear sources set after cleanup", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const signalC = new Signal<any>(() => signalA.v + signalB.v);

			signalC.v;
			expect((signalC as any)._sources.size).toBe(2);

			signalC.v = 50;
			expect((signalC as any)._sources.size).toBe(0);
		});

		it("should rebuild dependencies on re-computation", () => {
			const signalA = new Signal(1);
			const signalB = new Signal<any>(() => signalA.v * 2);

			// Initial computation
			signalB.v;
			expect((signalB as any)._sources.size).toBe(1);

			// Change to a direct value (removes dependencies)
			signalB.v = 100;
			expect((signalB as any)._sources.size).toBe(0);

			// Reset signalA for fresh start
			signalA.v = 2;

			// Change back to computed and rebuild dependencies
			signalB.v = () => signalA.v * 3;
			const value = signalB.v;
			expect(value).toBe(6);
			expect((signalB as any)._sources.size).toBe(1);
		});
	});

	describe("Self-Referencing", () => {
		it("should NOT create circular dependency", () => {
			const signal = new Signal<any>(42);
			// Signal accessing its own value doesn't create a dependency
			signal.v = () => signal.v + 1;
			expect(() => signal.v).toThrow();
		});

		it("should throw on indirect circular dependencies", () => {
			const signalA = new Signal<any>(1);
			const signalB = new Signal<any>(() => (signalA.v as number) * 2);
			const signalC = new Signal<any>(() => (signalB.v as number) * 2);

			// Establish dependencies: A -> B -> C
			signalB.v;
			signalC.v;

			// Verify dependencies
			expect((signalA as any)._listeners.has(signalB)).toBe(true);
			expect((signalB as any)._listeners.has(signalC)).toBe(true);

			// Change signalA to depend on signalC, creating A -> B -> C -> A cycle
			signalA.v = () => signalC.v + 1;
			expect(() => {
				signalA.v;
			}).toThrow();
		});
	});
});
