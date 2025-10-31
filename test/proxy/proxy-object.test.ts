import { describe, it, expect } from "vitest";
import { Signal } from "../../src";

describe("Proxy object", () => {
	it("should be dirty when Proxy assigned", () => {
		const p = new Signal(new Proxy({ a: 1 }, { get: () => 2 }));
		p.v = new Proxy({ a: 3 }, { get: () => 4 });
		expect((p as any)._isDirty).toBe(true);
		expect(p.v.a).toBe(4);
	});
	it("should NOT be dirty when Proxy read method (non-mutating)", () => {
		const p = new Signal(new Proxy({ a: 1 }, { get: () => 2 }));
		p.v.a;
		expect((p as any)._isDirty).toBe(false);
	});
	it("should be dirty when Proxy change to primitive type", () => {
		const p = new Signal(
			new Proxy(
				{ a: 5 },
				{
					get(target, prop) {
						return target[prop];
					},
					set(target, prop, value) {
						target[prop] = value * 2;
						return true;
					},
				}
			)
		);
		p.v.a = 10;
		expect((p as any)._isDirty).toBe(true);
		expect(p.v.a).toBe(20);
	});
});
