# ProxSignal

[![npm version](https://img.shields.io/npm/v/proxsignal)](https://www.npmjs.com/package/proxsignal)
[![Coverage](https://img.shields.io/codecov/c/github/francescomatteis/proxsignal)](https://codecov.io/github/francescomatteis/proxsignal)
[![npm downloads](https://img.shields.io/npm/dm/proxsignal)](https://www.npmjs.com/package/proxsignal)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/proxsignal)](https://bundlephobia.com/package/proxsignal)
[![License](https://img.shields.io/npm/l/proxsignal)](https://github.com/francescomatteis/proxsignal)
[![GitHub issues](https://img.shields.io/github/issues/francescomatteis/proxsignal)](https://github.com/francescomatteis/proxsignal/issues)

A minimal and lightweight reactive signal library for JavaScript and TypeScript with automatic dependency tracking and efficient caching.

## Philosophy

ProxSignal is a reactive signal library that provides a unified API for managing state and computed values in JavaScript and TypeScript applications. ProxSignal treats regular signals and computed signals as equals, the same `Signal` class handles both primitive values and derived computations.

## Features

-   🚀 **Lightweight** - Minimal code footprint with zero external dependencies
-   ⚡ **Performant** - Efficient caching and synchronous dependency tracking
-   🔄 **Reactive** - Automatic updates when dependencies change
-   🎯 **TypeScript** - Full TypeScript support with type inference
-   🔗 **Unified API** - No distinction between regular and computed signals
-   ✨ **Effects** - Side effects that run when signals change
-   🛡️ **Proxy-based** - Deep reactivity for objects, arrays, and collections
-   📦 **Zero Dependencies** - No external dependencies required

## Installation

Install ProxSignal using npm:

```bash
npm install proxsignal
```

## Usage

### Basic Usage

Create signals with primitive values:

```typescript
import { Signal } from "proxsignal";

const count = new Signal(0);
console.log(count.v); // 0

count.v = 10;
console.log(count.v); // 10
```

### Computed Signals

Create computed signals by passing a function:

```typescript
import { Signal } from "proxsignal";

const a = new Signal(5);
const b = new Signal(10);

// Create a computed signal
const sum = new Signal(() => a.v + b.v);
console.log(sum.v); // 15

// Update a signal value - computed signals automatically recompute
a.v = 7;
console.log(sum.v); // 17
```

### Switching Between Values and Computations

One of ProxSignal's key features is that the same signal can seamlessly switch between holding a static value and being a computed signal. This flexibility allows you to change how a signal behaves at runtime:

```typescript
import { Signal } from "proxsignal";

const a = new Signal(5);
const b = new Signal(10);

// Start with a static value
let result = new Signal(15);
console.log(result.v); // 15

// Convert to a computed signal that depends on a and b
result.v = () => a.v + b.v;
console.log(result.v); // 15 (5 + 10)

// Update dependencies - computed signal automatically recomputes
a.v = 7;
console.log(result.v); // 17 (7 + 10)

// Convert back to a static value
result.v = 100;
console.log(result.v); // 100

// You can even make a signal depend on another computed signal
const multiplier = new Signal(2);
result.v = () => a.v * multiplier.v;
console.log(result.v); // 14 (7 * 2)

multiplier.v = () => b.v / 2;
console.log(result.v); // 35 (7 * 5, since multiplier.v = 10 / 2 = 5)
```

With ProxSignal, signals are flexible and can seamlessly shift between static values and dynamic computations at any time.

### The `.v` Property

The `.v` property is your main interface for reading and writing signal values:

-   **Reading**: Use `signal.v` to get the current value
-   **Writing**: Use `signal.v = value` to update the value
-   **Reading in computed functions**: When creating computed signals, read dependencies using `otherSignal.v` inside the function

**Important**: `.v` is a property, not a function. Don't call it as `signal.v()`.

### Deep Reactivity

Signals can hold objects, arrays, Map, Set, and Classes. Any nested property becomes automatically reactive:

```typescript
import { Signal } from "proxsignal";

const person = new Signal({
	name: "Alice",
	address: { city: "Wonderland" },
});

const name = new Signal(() => person.v.name);

// Update nested properties directly - reactivity works at any depth
person.v.name = "Bob";
console.log(name.v); // "Bob"
```

### Effects

Use `.onChange` to react to updates in a `Signal`:

```typescript
import { Signal } from "proxsignal";

const name = new Signal("Alice");

const message = new Signal(() => `Hello, ${name.v}!`);

// Register an effect that runs whenever message or its dependencies change
message.onChange(() => {
	console.log(message.v);
});

name.v = "Bob"; // Logs: Hello, Bob!
```

### Effect Batching

Effects are automatically batched within the same microtask. If you update several signals synchronously, effects run only once after all updates:

```typescript
const first = new Signal("A");
const last = new Signal("Z");

function logFull() {
	console.log(`Full: ${first.v} ${last.v}`);
}

first.onChange(logFull);
last.onChange(logFull);

// Changing both signals synchronously
first.v = "B";
last.v = "Y";
// logFull() runs only once after both have changed (not twice)
```

### Effect Loop Prevention (Weird Behavior)

Effects cannot create infinite loops. If an effect modifies a signal that would trigger itself again, the loop is prevented. This may seem unexpected, but it's intentional behavior:

```typescript
import { Signal } from "proxsignal";

const signal = new Signal(0);
const computed = new Signal(() => signal.v * 2);

computed.onChange(() => {
	console.log("EFFECT CALLED");
	signal.v++;
});

signal.v = 1; // Effect runs once, but modifying signal.v inside the effect doesn't trigger it again
```

This is intentional behavior to prevent infinite loops when effects modify their own dependencies.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

For detailed information about contributing, including code style guidelines, development setup, testing, and the pull request process, please see the [Contributing Guide](./CONTRIBUTING.md).

## License

MIT © Francisco Matteis

Made with ❤️ for building reactive applications.
