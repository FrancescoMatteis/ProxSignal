import { describe, it, expect, beforeEach } from "vitest";
import { Signal } from "../src";

function hasInWeakRefArray<T extends object>(arr: WeakRef<T>[], item: T): boolean {
	return arr.some((ref) => ref.deref() === item);
}

describe("Signal Management", () => {
	describe("Listener Management", () => {
		it("should handle duplicate listener additions", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);

			signalA.addListener(signalB);
			signalA.addListener(signalB);

			expect((signalA as any)._listeners.length).toBe(1);
		});
	});

	describe("Source Management", () => {
		it("should update depth when adding source", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);

			(signalA as any)._depth = 0;
			(signalB as any)._depth = 0;

			signalB.addSource(signalA);

			expect((signalB as any)._depth).toBe(1);
		});

		it("should maintain correct depth with multiple sources", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const signalC = new Signal(3);

			(signalA as any)._depth = 0;
			(signalB as any)._depth = 0;
			(signalC as any)._depth = 2;

			signalB.addSource(signalA);
			signalB.addSource(signalC);

			expect((signalB as any)._depth).toBe(3);
		});

		it("should remove all sources correctly", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const signalC = new Signal(3);

			signalB.addSource(signalA);
			signalB.addSource(signalC);

			signalB.removeAllSources();

			expect((signalB as any)._sources.length).toBe(0);
		});

		it("should track sources in set", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const signalC = new Signal(3);

			signalB.addSource(signalA);
			signalB.addSource(signalC);

			expect((signalB as any)._sources.length).toBe(2);
			expect(hasInWeakRefArray((signalB as any)._sources, signalA)).toBe(true);
			expect(hasInWeakRefArray((signalB as any)._sources, signalC)).toBe(true);
		});
	});

	describe("Relationship Management", () => {
		it("should maintain bidirectional relationship (listener ↔ source)", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);

			signalA.addListener(signalB);
			signalB.addSource(signalA);

			expect(hasInWeakRefArray((signalA as any)._listeners, signalB)).toBe(true);
			expect(hasInWeakRefArray((signalB as any)._sources, signalA)).toBe(true);
		});

		it("should clean up relationships properly", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);

			signalA.addListener(signalB);
			signalB.addSource(signalA);

			signalB.removeAllSources();

			expect((signalB as any)._sources.length).toBe(0);
			expect(hasInWeakRefArray((signalA as any)._listeners, signalB)).toBe(false);
		});

		it("should handle complex dependency graphs", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const signalC = new Signal(3);
			const signalD = new Signal(4);

			// Create graph: A -> B -> C, A -> D
			signalA.addListener(signalB);
			signalB.addSource(signalA);
			signalB.addListener(signalC);
			signalC.addSource(signalB);
			signalA.addListener(signalD);
			signalD.addSource(signalA);

			expect((signalA as any)._listeners.length).toBe(2);
			expect((signalB as any)._sources.length).toBe(1);
			expect((signalC as any)._sources.length).toBe(1);
			expect((signalD as any)._sources.length).toBe(1);
		});

		it("should update depth correctly in dependency chain", () => {
			const signalA = new Signal(1);
			const signalB = new Signal(2);
			const signalC = new Signal(3);

			(signalA as any)._depth = 0;
			(signalB as any)._depth = 0;
			(signalC as any)._depth = 0;

			// A -> B -> C
			signalB.addSource(signalA);
			signalC.addSource(signalB);

			expect((signalB as any)._depth).toBe(1);
			expect((signalC as any)._depth).toBe(2);
		});
	});
});
