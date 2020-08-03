module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential"],
  rules: {
    "no-console": "off",
    "no-debugger": 0,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
