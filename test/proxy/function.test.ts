import { describe, it, expect } from "vitest";
import { Signal } from "../../src";

describe("Function", () => {
	it("should be dirty when function assigned", () => {
		const p = new Signal<Function>(function () {
			return "hello";
		});
		p.v = function () {
			return "world";
		};
		expect((p as any)._isDirty).toBe(true);
		expect(p.v).toBe("world");
	});
	it("should NOT be dirty when function read method (non-mutating)", () => {
		const p = new Signal<Function>(function () {
			return "hello";
		});
		let result = p.v;
		expect((p as any)._isDirty).toBe(false);
	});
	it("should be dirty when function change to primitive type", () => {
		const p = new Signal<any>(function () {
			return "hello";
		});
		p.v = 100;
		expect((p as any)._isDirty).toBe(true);
		expect(p.v).toBe(100);
	});
});
