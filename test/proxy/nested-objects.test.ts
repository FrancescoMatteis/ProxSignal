import { describe, it, expect } from "vitest";
import { Signal } from "../../src";

describe("Nested objects", () => {
	it("should be dirty when nested object assigned", () => {
		const p = new Signal({ a: { b: { c: 3 } } });
		p.v.a.b.c = 4;
		expect((p as any)._isDirty).toBe(true);
		expect(p.v.a.b.c).toBe(4);
	});
	it("should be dirty when nested object reassigned", () => {
		const p = new Signal<any>({ a: { b: { c: 3 } } });
		p.v.a.b.c = [1, 2, 3];
		expect((p as any)._isDirty).toBe(true);
		expect(p.v.a.b.c).toEqual([1, 2, 3]);
	});
});
