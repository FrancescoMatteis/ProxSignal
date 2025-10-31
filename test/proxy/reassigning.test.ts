import { describe, it, expect } from "vitest";
import { Signal } from "../../src";

describe("Reassigning", () => {
	it("should be dirty when reassigned", () => {
		const p = new Signal<any>(1);
		p.v = true;
		expect((p as any)._isDirty).toBe(true);
		expect(p.v).toBe(true);
	});
	it("should be dirty when reassigned to a different primitive type", () => {
		const p = new Signal<any>(1);
		p.v = "hello";
		expect((p as any)._isDirty).toBe(true);
		expect(p.v).toBe("hello");
	});
	it("should be dirty when reassigned to a different object type", () => {
		const p = new Signal<any>(1);
		p.v = [1, 2, 3];
		expect((p as any)._isDirty).toBe(true);
		expect(p.v).toEqual([1, 2, 3]);

		(p as any)._isDirty = false;
		p.v.push(4);
		expect((p as any)._isDirty).toBe(true);
		expect(p.v).toEqual([1, 2, 3, 4]);
	});
	it("should be dirty when reassigned to a different function type", () => {
		const p = new Signal<any>(1);
		p.v = function () {
			return "hello";
		};
		expect((p as any)._isDirty).toBe(true);
		expect(p.v).toEqual("hello");
	});
});
