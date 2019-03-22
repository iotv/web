const {addPostcssPlugins, addBabelPreset, override} = require('customize-cra')

module.exports = override(
  addBabelPreset('@emotion/babel-preset-css-prop'),
  addPostcssPlugins([require('tailwindcss')('./tailwind.config.js')]),
)
