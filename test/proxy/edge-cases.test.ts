import { describe, it, expect } from "vitest";
import { Signal } from "../../src";

describe("Other edge cases", () => {
	it("should be dirty when assigned to symbol property", () => {
		const sym = Symbol("test");
		const p = new Signal({ [sym]: 1 });
		p.v[sym] = 2;
		expect((p as any)._isDirty).toBe(true);
		expect(p.v[sym]).toBe(2);
	});

	it("should be dirty when assigned to property with numeric key", () => {
		const p = new Signal({ 1: "a" });
		p.v[1] = "b";
		expect((p as any)._isDirty).toBe(true);
		expect(p.v[1]).toBe("b");
	});

	it("should be dirty when assigned to deeply nested array element", () => {
		const p = new Signal({
			arr: [
				[1, 2],
				[3, 4],
			],
		});
		p.v.arr[1][0] = 99;
		expect((p as any)._isDirty).toBe(true);
		expect(p.v.arr[1][0]).toBe(99);
	});

	it("should be dirty when assigned to property with undefined key", () => {
		const p = new Signal<any>({});
		// @ts-ignore
		p.v[undefined] = "value";
		expect((p as any)._isDirty).toBe(true);
		// @ts-ignore
		expect(p.v[undefined]).toBe("value");
	});

	it("should be dirty when assigned to property with null key", () => {
		const p = new Signal({});
		// @ts-ignore
		p.v[null] = "value";
		expect((p as any)._isDirty).toBe(true);
		// @ts-ignore
		expect(p.v[null]).toBe("value");
	});

	it("should be dirty when assigned to property with object key (coerced to string)", () => {
		const key = {};
		const p = new Signal({});
		// @ts-ignore
		p.v[key] = "value";
		expect((p as any)._isDirty).toBe(true);
		// @ts-ignore
		expect(p.v[key]).toBe("value");
	});

	it("should be dirty when assigned to property with array key (coerced to string)", () => {
		const key = [1, 2, 3];
		const p = new Signal({});
		// @ts-ignore
		p.v[key] = "value";
		expect((p as any)._isDirty).toBe(true);
		// @ts-ignore
		expect(p.v[key]).toBe("value");
	});

	it("should be dirty when assigned to property with function key (coerced to string)", () => {
		const key = function () {};
		const p = new Signal({});
		// @ts-ignore
		p.v[key] = "value";
		expect((p as any)._isDirty).toBe(true);
		// @ts-ignore
		expect(p.v[key]).toBe("value");
	});

	it("should be dirty when assigned to property with NaN key", () => {
		const p = new Signal({});
		p.v[NaN] = "value";
		expect((p as any)._isDirty).toBe(true);
		expect(p.v[NaN]).toBe("value");
	});

	it("should be dirty when assigned to property with Infinity key", () => {
		const p = new Signal({});
		p.v[Infinity] = "value";
		expect((p as any)._isDirty).toBe(true);
		expect(p.v[Infinity]).toBe("value");
	});

	it("should be dirty when assigned to property with empty string key", () => {
		const p = new Signal({});
		p.v[""] = "value";
		expect((p as any)._isDirty).toBe(true);
		expect(p.v[""]).toBe("value");
	});

	it("should be dirty when assigned to property with special characters in key", () => {
		const p = new Signal({});
		p.v["!@#$%^&*()"] = "value";
		expect((p as any)._isDirty).toBe(true);
		expect(p.v["!@#$%^&*()"]).toBe("value");
	});

	it("should be dirty when assigned to property with long string key", () => {
		const longKey = "x".repeat(1000);
		const p = new Signal({});
		p.v[longKey] = "value";
		expect((p as any)._isDirty).toBe(true);
		expect(p.v[longKey]).toBe("value");
	});
});
