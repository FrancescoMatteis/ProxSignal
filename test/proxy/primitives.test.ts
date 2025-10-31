import { describe, it, expect } from "vitest";
import { Signal } from "../../src";

describe("Primitives", () => {
	describe("Number primitive", () => {
		it("should be dirty when Number set", () => {
			const p = new Signal(1);
			p.v = 2;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(2);
		});

		it("should be dirty when incremented with ++", () => {
			const p = new Signal(1);
			p.v++;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(2);
		});

		it("should be dirty when incremented with += 2", () => {
			const p = new Signal(3);
			p.v += 2;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(5);
		});
	});

	describe("String primitive", () => {
		it("should be dirty when String set", () => {
			const p = new Signal("a");
			p.v = "b";
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe("b");
		});

		it("should be dirty when concatenated with +=", () => {
			const p = new Signal("a");
			p.v += "b";
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe("ab");
		});

		it("should be dirty when reassigned with toUpperCase", () => {
			const p = new Signal("hello");
			p.v = p.v.toUpperCase();
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe("HELLO");
		});
	});

	describe("Boolean primitive", () => {
		it("should be dirty when Boolean set", () => {
			const p = new Signal(true);
			p.v = false;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(false);
		});

		it("should be dirty when toggled with logical NOT", () => {
			const p = new Signal(true);
			p.v = !p.v;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(false);
		});

		it("should be dirty when assigned with ||=", () => {
			const p = new Signal(false);
			p.v ||= true;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(true);
		});
	});

	describe("BigInt primitive", () => {
		it("should be dirty when BigInt set", () => {
			const p = new Signal(1n);
			p.v = 2n;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(2n);
		});

		it("should be dirty when incremented with ++", () => {
			const p = new Signal(1n);
			p.v++;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(2n);
		});

		it("should be dirty when incremented with += 10n", () => {
			const p = new Signal(5n);
			p.v += 10n;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(15n);
		});
	});

	describe("Symbol primitive", () => {
		it("should be dirty when Symbol set", () => {
			const s1 = Symbol("a");
			const s2 = Symbol("b");
			const p = new Signal<any>(s1);
			p.v = s2;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(s2);
		});

		it("should be dirty when reassigned with a different Symbol", () => {
			const s1 = Symbol("a");
			const s2 = Symbol("b");
			const p = new Signal<any>(s1);
			p.v = s2;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(s2);
		});
	});

	describe("Undefined primitive", () => {
		it("should be dirty when Undefined set", () => {
			const p = new Signal<any>(undefined);
			p.v = "defined";
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe("defined");
		});

		it("should be dirty when assigned with ??=", () => {
			const p = new Signal<any>(undefined);
			p.v ??= "defined";
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe("defined");
		});

		it("should be dirty when reassigned to undefined", () => {
			const p = new Signal<any>("x");
			p.v = undefined;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBeUndefined();
		});
	});

	describe("Null primitive", () => {
		it("should be dirty when Null set", () => {
			const p = new Signal<any>(null);
			p.v = 0;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(0);
		});

		it("should be dirty when assigned with ??=", () => {
			const p = new Signal<any>(null);
			p.v ??= 0;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe(0);
		});

		it("should be dirty when reassigned to undefined", () => {
			const p = new Signal<any>(1);
			p.v = undefined;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBeUndefined();
		});
	});
});
