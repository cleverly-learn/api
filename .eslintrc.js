const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    'unused-imports',
    'no-relative-import-paths',
    'sort-imports-es6-autofix',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': WARN,

    'import/prefer-default-export': OFF,
    'import/order': OFF,
    'import/no-default-export': ERROR,

    '@typescript-eslint/interface-name-prefix': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,

    'class-methods-use-this': OFF,

    'unused-imports/no-unused-imports': WARN,
    'no-relative-import-paths/no-relative-import-paths': [
      WARN,
      { rootDir: 'src' },
    ],
    'sort-imports-es6-autofix/sort-imports-es6': WARN,
  },
};
