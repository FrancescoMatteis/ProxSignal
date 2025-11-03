import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "text-summary", "lcov"], // Show detailed report and summary in command line, lcov for Codecov
			include: ["src/**/*.ts"], // Include all TypeScript files for coverage
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
});
