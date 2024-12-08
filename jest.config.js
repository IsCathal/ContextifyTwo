export default {
  roots: ['<rootDir>/src'], // Define the root folder for tests
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map `@/` to `src/` if using aliases
  },
  transform: {
    '^.+\\.js$': 'babel-jest', // Use Babel for ES6+ transformation
  },
  testEnvironment: 'jest-environment-jsdom', // Set the test environment to jsdom
};
