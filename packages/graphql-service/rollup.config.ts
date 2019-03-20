import resolve from 'rollup-plugin-node-resolve'

import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'

import {camelCase} from 'lodash'

const pkg = require('./package.json')

export default {
  input: 'src/handler.ts',
  output: [
    {file: pkg.main, name: camelCase(pkg.name), format: 'cjs', sourcemap: true},
  ],
  plugins: [
    json(),
    resolve({preferBuiltins: true}),
    commonjs(),
    typescript({useTsconfigDeclarationDir: true}),
  ],
  watch: {
    inclue: 'src/**',
  },
}
