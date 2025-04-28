export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  extensionsToTreatAsEsm: ['.jsx'],
  moduleNameMapper: {
    '^.+\\.svg$': '<rootDir>/src/__mocks__/svgrMock.js',
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '^.+\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@babel|))']
}