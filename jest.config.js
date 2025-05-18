export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
      '^.+\\.[tj]sx?$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.jest.json'
        }
      ]
    }
};