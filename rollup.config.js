// Import rollup plugins
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-import-css';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';

export default {
  plugins: [
    // Resolve bare module specifiers to relative paths
    resolve(),
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    // Get any CSS in JS imports
    css(),
    // Remove old dist directory
    del({
      targets: './demo/javascript',
    }),
    copy({ targets:
      [
        { src: 'node_modules/@patternfly/pfelement/dist/**/*', dest: './demo/javascript/@patternfly/pfelement' },
        { src: 'node_modules/@patternfly/pfe-jump-links/**/*', dest: './demo/javascript/@patternfly/pfe-jump-links' },
        { src: 'node_modules/@patternfly/pfe-icon/**/*', dest: './demo/javascript/@patternfly/pfe-icon' },
        { src: 'node_modules/@patternfly/pfe-avatar/**/*', dest: './demo/javascript/@patternfly/pfe-avatar' },
        { src: 'node_modules/@patternfly/pfe-accordion/**/*', dest: './demo/javascript/@patternfly/pfe-accordion' },
        { src: 'node_modules/@patternfly/pfe-content-set/**/*', dest: './demo/javascript/@patternfly/pfe-content-set' },
        { src: 'node_modules/@cpelements/pfe-navigation/**/*', dest: './demo/javascript/@cpelements/pfe-navigation' },
      ]
    }),
  ],
  // Single bundle example
  input: 'demo/main.js',
  output: [{
    dir: 'demo/javascript/',
    entryFileNames: 'bundle.js',
    chunkFileNames: 'bundle-chunk.js',
    format: 'esm'
  }],
  preserveEntrySignatures: 'strict',
};
