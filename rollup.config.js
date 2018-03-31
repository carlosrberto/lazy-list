import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    name: 'LazyList',
    file: 'lib/index.js',
    format: 'umd',
  },
  plugins: [
    babel(),
  ],
};
