export default {
  roots: ['<rootDir>/src'], // Set Jest's root directory
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1' // Map `@/` to `src/` if using aliases
  },
  transform: {
    '^.+\\.js$': 'babel-jest' // Use Babel to transform ES6+
  },
  testEnvironment: 'node' // Use Node.js environment for tests
};
