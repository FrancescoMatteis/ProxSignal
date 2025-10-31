const MUTATING_COLLECTION_METHODS = new Set([
	"set",
	"add",
	"delete",
	"clear",
	"setFullYear",
	"setMonth",
	"setDate",
	"setHours",
	"setMinutes",
	"setSeconds",
	"setMilliseconds",
	"setUTCFullYear",
	"setUTCMonth",
	"setUTCDate",
	"setUTCHours",
	"setUTCMinutes",
	"setUTCSeconds",
	"setUTCMilliseconds",
]);

const MUTATING_ARRAY_BUFFER_METHODS = new Set(["byteLength", "slice", "resize", "transfer", "reverse", "sort"]);

/**
 * Creates a proxy for reactive objects with notification support.
 * Handles nested objects, Sets, Maps, Dates, ArrayBuffers, TypedArrays, and other special types.
 * @template T - The type of the object to proxy.
 * @param obj - The object to create a proxy for.
 * @param notifyFunction - The function to call when the object is modified.
 * @returns A proxied version of the object that triggers notifications on changes.
 */
export function creaProxy<T extends Record<string, any>>(obj: T, notifyFunction: () => void): T {
	return new Proxy(obj, {
		get(target, prop, receiver) {
			if (typeof target[prop as keyof typeof target] === "object" && target[prop as keyof typeof target] !== null) {
				return creaProxy(target[prop as keyof typeof target], notifyFunction);
			}

			if (
				typeof target[prop as keyof typeof target] === "function" &&
				(target instanceof Set || target instanceof WeakSet || target instanceof Map || target instanceof WeakMap || target instanceof Date)
			) {
				if (MUTATING_COLLECTION_METHODS.has(prop as string)) {
					notifyFunction();
				}
				return (target[prop as keyof typeof target] as Function).bind(target);
			}

			if ((target instanceof Promise || target instanceof RegExp) && typeof target[prop as keyof typeof target] === "function") {
				return (target[prop as keyof typeof target] as Function).bind(target);
			}

			if (
				(target instanceof ArrayBuffer ||
					target instanceof Uint8Array ||
					target instanceof Uint16Array ||
					target instanceof Uint32Array ||
					target instanceof Int8Array ||
					target instanceof Int16Array ||
					target instanceof Int32Array ||
					target instanceof Float32Array ||
					target instanceof Float64Array) &&
				typeof target[prop as keyof typeof target] === "function"
			) {
				if (MUTATING_ARRAY_BUFFER_METHODS.has(prop as string)) {
					notifyFunction();
				}
				return (target[prop as keyof typeof target] as Function).bind(target);
			}

			return Reflect.get(target, prop);
		},
		set(target, prop, value, receiver) {
			const result = Reflect.set(target, prop, value, receiver);
			notifyFunction();
			return result;
		},
	});
}
