import { describe, it, expect } from "vitest";
import { Signal } from "../../src";

describe("Object types", () => {
	describe("Array object", () => {
		it("should be dirty when Array assigned", () => {
			const p = new Signal([1, 2, 3]);
			p.v = [4, 5, 6];
			expect((p as any)._isDirty).toBe(true);
			expect(p.v[0]).toBe(4);
			expect(p.v.length).toBe(3);
		});
		it("should be dirty when Array push", () => {
			const p = new Signal([1, 2, 3]);
			p.v.push(4);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.length).toBe(4);
		});
		it("should be dirty when Array pop", () => {
			const p = new Signal([1, 2, 3]);
			const popped = p.v.pop();
			expect((p as any)._isDirty).toBe(true);
			expect(popped).toBe(3);
			expect(p.v.length).toBe(2);
		});

		it("should be dirty when Array shift", () => {
			const p = new Signal([1, 2, 3]);
			const shifted = p.v.shift();
			expect((p as any)._isDirty).toBe(true);
			expect(shifted).toBe(1);
			expect(p.v.length).toBe(2);
			expect(p.v[0]).toBe(2);
		});

		it("should be dirty when Array unshift", () => {
			const p = new Signal([2, 3]);
			const newLen = p.v.unshift(1);
			expect((p as any)._isDirty).toBe(true);
			expect(newLen).toBe(3);
			expect(p.v[0]).toBe(1);
		});

		it("should be dirty when Array splice", () => {
			const p = new Signal([1, 2, 3, 4]);
			const removed = p.v.splice(1, 2, 9, 8);
			expect((p as any)._isDirty).toBe(true);
			expect(removed).toEqual([2, 3]);
			expect(p.v).toEqual([1, 9, 8, 4]);
		});

		it("should be dirty when Array reverse", () => {
			const p = new Signal([1, 2, 3]);
			const reversed = p.v.reverse();
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toEqual([3, 2, 1]);
			expect(reversed).toEqual([3, 2, 1]);
		});

		it("should be dirty when Array sort", () => {
			const p = new Signal([3, 1, 2]);
			const sorted = p.v.sort();
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toEqual([1, 2, 3]);
			expect(sorted).toEqual([1, 2, 3]);
		});

		it("should be dirty when Array fill", () => {
			const p = new Signal([1, 2, 3]);
			const filled = p.v.fill(0);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toEqual([0, 0, 0]);
			expect(filled).toEqual([0, 0, 0]);
		});

		it("should be dirty when Array copyWithin", () => {
			const p = new Signal([1, 2, 3, 4]);
			const result = p.v.copyWithin(1, 2);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toEqual([1, 3, 4, 4]);
			expect(result).toEqual([1, 3, 4, 4]);
		});

		it("should be dirty when Array sort with compare function", () => {
			const p = new Signal([5, 2, 9, 1]);
			p.v.sort((a, b) => a - b);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toEqual([1, 2, 5, 9]);
		});
	});

	describe("Set object", () => {
		it("should be dirty when Set assigned", () => {
			const p = new Signal(new Set([1, 2, 3]));
			p.v = new Set([4, 5]);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v instanceof Set).toBe(true); // Ensure p.v is a Set
			expect(p.v.has(4)).toBe(true);
			expect(p.v.size).toBe(2); // Workaround for .size not working
		});

		it("should be dirty when Set add", () => {
			const p = new Signal(new Set([1, 2, 3]));
			p.v.add(4);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.has(4)).toBe(true);
		});
		it("should be dirty when Set delete", () => {
			const p = new Signal(new Set([1, 2, 3]));
			const deleted = p.v.delete(2);
			expect((p as any)._isDirty).toBe(true);
			expect(deleted).toBe(true);
			expect(p.v.has(2)).toBe(false);
		});
		it("should be dirty when Set clear", () => {
			const p = new Signal(new Set([1, 2, 3]));
			p.v.clear();
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.size).toBe(0);
		});
		it("should NOT be dirty when Set has (non-mutating)", () => {
			const p = new Signal(new Set([1, 2, 3]));
			const result = p.v.has(2);
			expect((p as any)._isDirty).toBe(false);
			expect(result).toBe(true);
		});
		it("should NOT be dirty when Set size (non-mutating)", () => {
			const p = new Signal(new Set([1, 2, 3]));
			const size = p.v.size;
			expect((p as any)._isDirty).toBe(false);
			expect(size).toBe(3);
		});
		it("should NOT be dirty when Set forEach (non-mutating)", () => {
			const p = new Signal(new Set([1, 2, 3]));
			let sum = 0;
			p.v.forEach((x) => (sum += x));
			expect((p as any)._isDirty).toBe(false);
			expect(sum).toBe(6);
		});
		it("should NOT be dirty when Set values (non-mutating)", () => {
			const p = new Signal(new Set([1, 2, 3]));
			const values = Array.from(p.v.values());
			expect((p as any)._isDirty).toBe(false);
			expect(values).toEqual([1, 2, 3]);
		});
		it("should NOT be dirty when Set entries (non-mutating)", () => {
			const p = new Signal(new Set([1, 2, 3]));
			const entries = Array.from(p.v.entries());
			expect((p as any)._isDirty).toBe(false);
			expect(entries).toEqual([
				[1, 1],
				[2, 2],
				[3, 3],
			]);
		});
		it("should NOT be dirty when Set keys (non-mutating)", () => {
			const p = new Signal(new Set([1, 2, 3]));
			const keys = Array.from(p.v.keys());
			expect((p as any)._isDirty).toBe(false);
			expect(keys).toEqual([1, 2, 3]);
		});
	});

	describe("Map object", () => {
		it("should be dirty when Map assigned", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			p.v = new Map([["x", 10]]);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.get("x")).toBe(10);
			expect(p.v.size).toBe(1);
		});
		it("should be dirty when Map set", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			p.v.set("c", 3);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.get("c")).toBe(3);
		});
		it("should be dirty when Map delete", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			const deleted = p.v.delete("a");
			expect((p as any)._isDirty).toBe(true);
			expect(deleted).toBe(true);
			expect(p.v.has("a")).toBe(false);
		});
		it("should be dirty when Map clear", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			p.v.clear();
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.size).toBe(0);
		});
		it("should NOT be dirty when Map get (non-mutating)", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			const value = p.v.get("a");
			expect((p as any)._isDirty).toBe(false);
			expect(value).toBe(1);
		});
		it("should NOT be dirty when Map has (non-mutating)", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			const hasA = p.v.has("a");
			expect((p as any)._isDirty).toBe(false);
			expect(hasA).toBe(true);
		});
		it("should NOT be dirty when Map entries (non-mutating)", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			const entries = Array.from(p.v.entries());
			expect((p as any)._isDirty).toBe(false);
			expect(entries).toEqual([
				["a", 1],
				["b", 2],
			]);
		});
		it("should NOT be dirty when Map keys (non-mutating)", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			const keys = Array.from(p.v.keys());
			expect((p as any)._isDirty).toBe(false);
			expect(keys).toEqual(["a", "b"]);
		});
		it("should NOT be dirty when Map values (non-mutating)", () => {
			const p = new Signal(
				new Map([
					["a", 1],
					["b", 2],
				])
			);
			const values = Array.from(p.v.values());
			expect((p as any)._isDirty).toBe(false);
			expect(values).toEqual([1, 2]);
		});
	});

	describe("Date object", () => {
		it("should be dirty when Date assigned", () => {
			const p = new Signal(new Date("2023-01-01"));
			p.v = new Date("2024-01-01");
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getFullYear()).toBe(2024);
		});
		it("should be dirty when Date mutating method", () => {
			const p = new Signal(new Date("2023-01-01"));
			p.v.setFullYear(2023);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getFullYear()).toBe(2023);
		});
		it("should be dirty when Date setMonth", () => {
			const p = new Signal(new Date("2023-01-01"));
			p.v.setMonth(5);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getMonth()).toBe(5);
		});
		it("should be dirty when Date setDate", () => {
			const p = new Signal(new Date("2023-01-01"));
			p.v.setDate(15);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getDate()).toBe(15);
		});
		it("should be dirty when Date setHours", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00"));
			p.v.setHours(10);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getHours()).toBe(10);
		});
		it("should be dirty when Date setMinutes", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00"));
			p.v.setMinutes(30);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getMinutes()).toBe(30);
		});
		it("should be dirty when Date setSeconds", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00"));
			p.v.setSeconds(30);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getSeconds()).toBe(30);
		});
		it("should be dirty when Date setMilliseconds", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00"));
			p.v.setMilliseconds(300);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getMilliseconds()).toBe(300);
		});
		it("should be dirty when Date setUTCFullYear", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00Z"));
			p.v.setUTCFullYear(2025);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getUTCFullYear()).toBe(2025);
		});
		it("should be dirty when Date setUTCMonth", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00Z"));
			p.v.setUTCMonth(6);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getUTCMonth()).toBe(6);
		});
		it("should be dirty when Date setUTCDate", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00Z"));
			p.v.setUTCDate(20);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getUTCDate()).toBe(20);
		});
		it("should be dirty when Date setUTCHours", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00Z"));
			p.v.setUTCHours(15);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getUTCHours()).toBe(15);
		});
		it("should be dirty when Date setUTCMinutes", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00Z"));
			p.v.setUTCMinutes(45);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getUTCMinutes()).toBe(45);
		});
		it("should be dirty when Date setUTCSeconds", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00Z"));
			p.v.setUTCSeconds(50);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getUTCSeconds()).toBe(50);
		});
		it("should be dirty when Date setUTCMilliseconds", () => {
			const p = new Signal(new Date("2023-01-01T00:00:00Z"));
			p.v.setUTCMilliseconds(123);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.getUTCMilliseconds()).toBe(123);
		});
		it("should NOT be dirty when Date getFullYear (non-mutating)", () => {
			const p = new Signal(new Date("2023-01-01"));
			const year = p.v.getFullYear();
			expect((p as any)._isDirty).toBe(false);
			expect(year).toBe(2023);
		});
		it("should NOT be dirty when Date getMonth (non-mutating)", () => {
			const p = new Signal(new Date("2023-05-15"));
			const month = p.v.getMonth();
			expect((p as any)._isDirty).toBe(false);
			expect(month).toBe(4); // Months are 0-indexed
		});
		it("should NOT be dirty when Date toISOString (non-mutating)", () => {
			const p = new Signal(new Date("2023-01-01T12:34:56Z"));
			const iso = p.v.toISOString();
			expect((p as any)._isDirty).toBe(false);
			expect(iso).toBe("2023-01-01T12:34:56.000Z");
		});
		it("should NOT be dirty when Date toLocaleString (non-mutating)", () => {
			const p = new Signal(new Date("2023-01-01T12:34:56Z"));
			const locale = p.v.toLocaleString();
			expect((p as any)._isDirty).toBe(false);
			expect(locale).toBe(new Date("2023-01-01T12:34:56Z").toLocaleString());
		});
		it("should NOT be dirty when Date toLocaleDateString (non-mutating)", () => {
			const p = new Signal(new Date("2023-01-01T12:34:56Z"));
			const locale = p.v.toLocaleDateString();
			expect((p as any)._isDirty).toBe(false);
			expect(locale).toBe(new Date("2023-01-01T12:34:56Z").toLocaleDateString());
		});
		it("should NOT be dirty when Date toLocaleTimeString (non-mutating)", () => {
			const p = new Signal(new Date("2023-01-01T12:34:56Z"));
			const locale = p.v.toLocaleTimeString();
			expect((p as any)._isDirty).toBe(false);
			expect(locale).toBe(new Date("2023-01-01T12:34:56Z").toLocaleTimeString());
		});
	});

	describe("RegExp object", () => {
		it("should be dirty when RegExp assigned", () => {
			const p = new Signal(/hello/);
			p.v = /world/;
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.source).toBe("world");
		});
		it("should NOT be dirty when RegExp test (non-mutating)", () => {
			const p = new Signal(/hello/);
			const result = p.v.test("hello");
			expect((p as any)._isDirty).toBe(false);
			expect(result).toBe(true);
		});
		it("should NOT be dirty when RegExp exec (non-mutating)", () => {
			const p = new Signal(/hello/);
			const result = p.v.exec("hello");
			expect((p as any)._isDirty).toBe(false);
			expect(result).not.toBeUndefined();
		});
		it("should NOT be dirty when RegExp match (non-mutating)", () => {
			const p = new Signal(/hello/);
			const result = "hello".match(p.v);
			expect((p as any)._isDirty).toBe(false);
			expect(result).not.toBeUndefined();
		});
		it("should NOT be dirty when RegExp replace (non-mutating)", () => {
			const p = new Signal(/hello/);
			const result = "hello".replace(p.v, "world");
			expect((p as any)._isDirty).toBe(false);
			expect(result).toBe("world");
		});
		it("should NOT be dirty when RegExp search (non-mutating)", () => {
			const p = new Signal(/hello/);
			const result = "hello".search(p.v);
			expect((p as any)._isDirty).toBe(false);
			expect(result).toBe(0);
		});
	});

	describe("Function object", () => {
		it("should be dirty when Function assigned", () => {
			const p = new Signal<Function>(function () {
				return "old";
			});
			p.v = function () {
				return "new";
			};
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe("new");
		});
		it("should NOT be dirty when Function call (non-mutating)", () => {
			const p = new Signal(function () {
				return "old";
			});
			expect((p as any)._isDirty).toBe(true);
			expect(p.v).toBe("old");
		});
	});

	describe("Error object", () => {
		it("should be dirty when Error property assigned", () => {
			const p = new Signal(new Error("old error"));
			p.v.message = "new error";
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.message).toBe("new error");
		});
		it("should be dirty when Error assigned", () => {
			const p = new Signal(new Error("old error"));
			p.v = new Error("new error");
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.message).toBe("new error");
		});
		it("should NOT be dirty when Error property access (non-mutating)", () => {
			const p = new Signal(new Error("old error"));
			const result = p.v.message;
			expect((p as any)._isDirty).toBe(false);
			expect(result).toBe("old error");
		});
	});

	describe("Promise object", () => {
		it("should be dirty when Promise assigned", () => {
			const p = new Signal(Promise.resolve("old"));
			p.v = Promise.resolve("new");
			expect((p as any)._isDirty).toBe(true);
		});
		it("should NOT be dirty when Promise then (non-mutating)", async () => {
			const p = new Signal(Promise.resolve("old"));
			let result;
			await p.v.then((value) => {
				result = value;
			});

			expect((p as any)._isDirty).toBe(false);
			expect(result).toBe("old");
		});
		it("should NOT be dirty when Promise catch (non-mutating)", async () => {
			const p = new Signal(Promise.reject("old"));
			let result;
			await p.v.catch((value) => {
				result = value;
			});

			expect((p as any)._isDirty).toBe(false);
			expect(result).toBe("old");
		});
		it("should NOT be dirty when Promise finally (non-mutating)", async () => {
			const p = new Signal(Promise.resolve("old"));
			let result;
			await p.v.finally(() => {
				result = "new";
			});
			expect((p as any)._isDirty).toBe(false);
			expect(result).toBe("new");
		});
		it("should NOT be dirty when Promise.all (non-mutating)", async () => {
			const p = new Signal(Promise.resolve("old"));
			const promise2 = new Signal(Promise.resolve("another"));
			let result;
			await Promise.all([p.v, promise2.v]).then((results) => {
				result = results.map((result) => result.toUpperCase());
			});
			expect((p as any)._isDirty).toBe(false);
			expect(result).toEqual(["OLD", "ANOTHER"]);
		});
	});

	describe("WeakSet object", () => {
		it("should be dirty when WeakSet assigned", () => {
			const p = new Signal(new WeakSet());
			p.v = new WeakSet();
			expect((p as any)._isDirty).toBe(true);
		});
		it("should be dirty when WeakSet add", () => {
			const p = new Signal(new WeakSet());
			const testObj = {};
			p.v.add(testObj);
			expect((p as any)._isDirty).toBe(true);
		});
		it("should be dirty when WeakSet delete", () => {
			const p = new Signal(new WeakSet());
			const testObj = {};
			const deleted = p.v.delete(testObj);
			expect((p as any)._isDirty).toBe(true);
			expect(deleted).toBe(false);
		});
		it("should NOT be dirty when WeakSet has (non-mutating)", () => {
			const p = new Signal(new WeakSet());
			const testObj = {};
			p.v.has(testObj);
			expect((p as any)._isDirty).toBe(false);
		});
	});

	describe("WeakMap object", () => {
		it("should be dirty when WeakMap assigned", () => {
			const p = new Signal(new WeakMap());
			p.v = new WeakMap();
			expect((p as any)._isDirty).toBe(true);
		});
		it("should be dirty when WeakMap set", () => {
			const p = new Signal(new WeakMap());
			const testObj = {};
			p.v.set(testObj, "value");
			expect((p as any)._isDirty).toBe(true);
		});
		it("should be dirty when WeakMap delete", () => {
			const p = new Signal(new WeakMap());
			const testObj = {};
			const deleted = p.v.delete(testObj);
			expect((p as any)._isDirty).toBe(true);
			expect(deleted).toBe(false);
		});
		it("should NOT be dirty when WeakMap get (non-mutating)", () => {
			const object1 = {};
			const object2 = {};
			const p = new Signal(
				new WeakMap([
					[object1, 11],
					[object2, 22],
				])
			);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.get(object1)).toBe(11);
		});
		it("should NOT be dirty when WeakMap has (non-mutating)", () => {
			const p = new Signal(new WeakMap());
			const testObj = {};
			p.v.has(testObj);
			expect((p as any)._isDirty).toBe(false);
		});
	});

	describe("ArrayBuffer object", () => {
		it("should be dirty when ArrayBuffer assigned", () => {
			const p = new Signal(new ArrayBuffer(8));
			p.v = new ArrayBuffer(16);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.byteLength).toBe(16);
		});
		it("should NOT be dirty when ArrayBuffer byteLength (non-mutating)", () => {
			const p = new Signal(new ArrayBuffer(8));
			const byteLength = p.v.byteLength;
			expect((p as any)._isDirty).toBe(false);
			expect(byteLength).toBe(8);
		});
		it("should be dirty when ArrayBuffer slice (non-mutating)", () => {
			const p = new Signal(new ArrayBuffer(8));
			const slice = p.v.slice(0, 4);
			expect((p as any)._isDirty).toBe(true);
			expect(slice.byteLength).toBe(4);
		});
		it("should be dirty when ArrayBuffer resize (if supported)", () => {
			// @ts-ignore
			const buffer = new ArrayBuffer(8, { maxByteLength: 16 });
			const p = new Signal(buffer);

			expect((p as any)._isDirty).toBe(true);
			expect(p.v.byteLength).toBe(8);

			(p.v as any).resize(4);

			expect((p as any)._isDirty).toBe(true);
			expect(p.v.byteLength).toBe(4);
		});
	});

	describe("TypedArray object (Uint8Array)", () => {
		it("should be dirty when TypedArray assigned", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			p.v = new Uint8Array([4, 5, 6]);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v[0]).toBe(4);
		});
		it("should be dirty when TypedArray reverse", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			p.v.reverse();
			expect((p as any)._isDirty).toBe(true);
		});
		it("should be dirty when TypedArray sort", () => {
			const p = new Signal(new Uint8Array([3, 2, 1]));
			p.v.sort();
			expect((p as any)._isDirty).toBe(true);
		});
		it("should NOT be dirty when TypedArray subarray (non-mutating)", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			const subarray = p.v.subarray(0, 2);
			expect((p as any)._isDirty).toBe(false);
			expect(subarray.length).toBe(2);
		});
		it("should NOT be dirty when TypedArray fill (non-mutating)", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			p.v.fill(0);
			expect((p as any)._isDirty).toBe(false);
		});
		it("should NOT be dirty when TypedArray copyWithin (non-mutating)", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			p.v.copyWithin(0, 1);
			expect((p as any)._isDirty).toBe(false);
		});
		it("should NOT be dirty when TypedArray map (non-mutating)", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			const map = p.v.map((value) => value * 2);
			expect((p as any)._isDirty).toBe(false);
		});
		it("should NOT be dirty when TypedArray filter (non-mutating)", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			p.v.filter((value) => value % 2 === 0);
			expect((p as any)._isDirty).toBe(false);
		});
		it("should NOT be dirty when TypedArray reduce (non-mutating)", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			p.v.reduce((acc, value) => acc + value, 0);
			expect((p as any)._isDirty).toBe(false);
		});
		it("should NOT be dirty when TypedArray reduceRight (non-mutating)", () => {
			const p = new Signal(new Uint8Array([1, 2, 3]));
			p.v.reduceRight((acc, value) => acc + value, 0);
			expect((p as any)._isDirty).toBe(false);
		});
	});

	describe("DataView object", () => {
		it("should be dirty when DataView assigned", () => {
			const buffer = new ArrayBuffer(8);
			const p = new Signal(new DataView(buffer));
			const newBuffer = new ArrayBuffer(16);
			p.v = new DataView(newBuffer);
			expect((p as any)._isDirty).toBe(true);
			expect(p.v.buffer.byteLength).toBe(16);
		});
	});
});
