import { describe, it, expect } from "vitest";
import { Signal } from "../../src";

class TestClass {
	public a: { b: { c: number } } = { b: { c: 3 } };
	constructor() {
		this.a = {
			b: {
				c: 3,
			},
		};
	}
	getA() {
		return this.a;
	}
	setC(c) {
		this.a.b.c = c;
	}
	plusGetB() {
		this.a.b.c += 10;
		return this.a.b;
	}
}

class SubTestClass extends TestClass {
	public extra: number = 0;
	constructor() {
		super();
		this.extra = 42;
	}
	setExtra(val) {
		this.extra = val;
	}
}

describe("Classes", () => {
	describe("TestClass", () => {
		it("should be dirty when class assigned", () => {
			const p = new Signal(new TestClass());
			p.v.setC(4);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.a.b.c).toBe(4);
		});
		it("should NOT be dirty when class read method (non-mutating)", () => {
			const p = new Signal(new TestClass());
			p.v.getA();
			expect((p as any)._isDirty).toBe(false);
		});
		it("should be dirty when class mutating method", () => {
			const p = new Signal(new TestClass());
			p.v.plusGetB();
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.a.b.c).toBe(13);
		});
	});
	describe("SubTestClass", () => {
		it("should be dirty when subclass assigned", () => {
			const p = new Signal(new SubTestClass());
			p.v.setC(7);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.a.b.c).toBe(7);
		});
		it("should be dirty when subclass mutating method", () => {
			const p = new Signal(new SubTestClass());
			p.v.setExtra(99);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.extra).toBe(99);
		});
		it("should NOT be dirty when subclass read method (non-mutating)", () => {
			const p = new Signal(new SubTestClass());
			p.v.getA();
			expect((p as any)._isDirty).toBe(false);
		});
		it("should be dirty when change from subclass to primitive type", () => {
			const p = new Signal<any>(new SubTestClass());
			p.v = 100;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(100);
		});
	});
});
