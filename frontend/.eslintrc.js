module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    // '@vue/typescript/recommended'
  ],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-this-alias': ['off'],
    'no-var': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    "prefer-const": 'off',
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any" :"off",
    "no-empty" : "off",
    "no-async-promise-executor" : "off",
    "no-useless-escape" : "off",
    "invalid-first-character-of-tag-name" : "off",
    "no-unused-vars" : "off",
    "vue/no-unused-components" : "off"
  },
}
