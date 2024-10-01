export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Ensure jsdom is set here
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Customize based on your project structure
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleDirectories: ['node_modules', 'src'],
  };
  