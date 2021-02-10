module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  plugins: ["vue", "jest"],
  // add your custom rules here
  rules: {
    semi: [2, "never"],
    "vue/html-closing-bracket-newline": "off",
    "prettier/prettier": ["error", { semi: false }],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
        },
      },
    ],
  },
}
