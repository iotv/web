const {addPostcssPlugins, override} = require('customize-cra')

module.exports = override(
  addPostcssPlugins([require('tailwindcss')('./tailwind.js')]),
)
