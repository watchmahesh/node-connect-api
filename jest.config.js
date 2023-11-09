module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
      "moduleFileExtensions": [
        "js",
        "json",
        "ts"
      ],
      "rootDir": "src",
      "testRegex": ".*\\.test\\.ts$",
      "testPathIgnorePatterns": [
        "/node_modules/"
      ]
  };
