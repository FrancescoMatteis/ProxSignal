# Contributing to ProxSignal

Thank you for your interest in contributing to ProxSignal! This document provides guidelines and information for contributors.

## Code Style

### JSDoc Comments

This project uses **JSDoc comment style** for all code documentation. Please follow these guidelines:

-   Use `/** */` style comments (not `//` or `/* */`) for all function, class, and method documentation
-   Include appropriate JSDoc tags such as:
    -   `@param` for function parameters
    -   `@returns` or `@return` for return values
    -   `@template` for generic type parameters
    -   `@description` for detailed descriptions (optional)
    -   `@example` for usage examples (optional)

**Example:**

```typescript
/**
 * Creates a new Signal instance with the given initial value.
 * @param value - The initial value for the signal.
 * @template T - The type of the signal value.
 */
constructor(value: T) {
    // implementation
}
```

### TypeScript

-   Use TypeScript with strict type checking
-   Prefer type inference where possible
-   Use meaningful type parameter names (e.g., `T`, `U`, `V` for generics)
-   Follow the existing code style and formatting

### Code Formatting

-   Use consistent indentation (spaces or tabs as per project standard)
-   Follow the existing naming conventions:
    -   Classes: PascalCase
    -   Functions/methods: camelCase
    -   Private members: prefix with `_`
    -   Constants: UPPER_SNAKE_CASE

## Library Size Considerations

**Keep the library lightweight!** This is a core principle of ProxSignal. When contributing:

-   **Avoid unnecessary dependencies**: Don't add external packages unless absolutely necessary
-   **Prefer lightweight implementations**: Choose simple, efficient solutions over feature-rich but heavy alternatives
-   **Avoid feature bloat**: Consider whether a feature is truly essential before adding it
-   **Code efficiency**: Write concise, optimized code, every byte counts
-   **Tree-shaking friendly**: Ensure your code supports tree-shaking so unused code can be eliminated

Remember: The goal is to keep ProxSignal fast, small, and easy to bundle. If you're unsure whether your contribution aligns with this principle, please discuss it in an issue first.

## Development Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Build the project:
    ```bash
    npm run build
    ```
4. Run tests:
    ```bash
    npm test
    ```

## Testing

-   Write tests for all new features and bug fixes
-   Ensure all existing tests pass before submitting a pull request
-   Follow the existing test structure and naming conventions
-   Tests are located in the `test/` directory

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the code style guidelines
4. Ensure all tests pass (`npm test`)
5. Build the project successfully (`npm run build`)
6. Commit your changes with clear, descriptive commit messages
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Commit Messages

-   Use clear, descriptive commit messages
-   Reference issues when applicable (e.g., "Fix #123: description")
-   Keep commits focused on a single change when possible

## Reporting Issues

When reporting bugs or requesting features:

-   Use a clear, descriptive title
-   Provide detailed information about the issue
-   Include code examples or steps to reproduce (for bugs)
-   Specify the environment (Node.js version, TypeScript version, etc.)

## Questions?

If you have questions about contributing, please open an issue for discussion.

Thank you for contributing to ProxSignal!
