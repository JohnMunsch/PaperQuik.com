import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'public/js/main.js',
  output: {
    file: 'public/js/bundle.js',
    format: 'es',
  },
  plugins: [
    nodeResolve({ preferBuiltins: true }), // or `true`
    commonjs(),
  ],
};
