const fs = require('node:fs/promises');
const path = require('node:path');

const element = [...process.argv].pop();

console.log(element);

// if (!element.match(/^rh-/)) {
//   // eslint-disable-next-line no-console
//   console.log('Please specify a component e.g.', '\n\tnpm run proxy rh-footer');
//   process.exit(1);
// }

/**
 * @param {import('node:http').ClientRequest} _req
 * @param {import('node:http').ServerResponse} res
 * @param {() => void} next
 */
async function injectLocalSources(_req, res, next) {
  try {
    const proxyContents = await fs.readFile(path.join('demo', 'proxy.html'));

    const importMapJson = JSON.stringify(
      {
        "imports": {
          "@patternfly/elements/" : "https://www.redhatstatic.com/dx/v1-alpha/@patternfly/elements@2.2.2/",
          "@rhds/elements/rh-button/rh-button.js":"https://www.redhatstatic.com/dx/v1-alpha/@rhds/elements@1.1.0/elements/rh-button/rh-button.js",
          "@rhds/elements/":"https://www.redhatstatic.com/dx/v1-alpha/@rhds/elements@1.1.0/elements/",
          "@rhds/elements/lib/":"https://www.redhatstatic.com/dx/v1-alpha/@rhds/elements@1.1.0/lib/",
          "/src/super-clippy.js": "/src/super-clippy.js",
        }
      },);

    const { write: origWrite } = res;

    // eslint-disable-next-line func-names
    res.write = function(chunk, ...rest) {
      let someChunk = chunk;
      if (res.getHeader('Content-Type').includes('text/html')) {
        if (someChunk instanceof Buffer) {
          someChunk = chunk.toString();
        }

        someChunk = someChunk
          .replace('</head>', `<script type="importmap">${importMapJson}</script>\n</head>`)
          .replace('</body>', `${proxyContents}\n\n</body>`);

        res.setHeader('Content-Length', chunk.length);
      }
      origWrite.apply(this, [someChunk, ...rest]);
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    next();
  }
}

module.exports = {
  host: {
    local: 'localhost',
  },
  port: 'auto',
  open: !true,
  startPath: '/',
  verbose: false,
  routes: {
    // shut off web components bundle
    // '/sites/all/libraries/webrh/dist/js/webrh.webcomponents.min.js': '',

    '/node_modules/': {
      host: 'http://localhost:8000',
      path: '/node_modules/'
    },
    '/en/node_modules/': {
      host: 'http://localhost:8000',
      path: '/node_modules/'
    },

    '@rhds/elements/': {
      host: 'http://localhost:8000',
      path: '/elements/',
      watch: './elements/'
    },
    '/en/elements/': {
      host: 'http://localhost:8000',
      path: '/elements/',
      watch: './elements/'
    },
    '/elements/': {
      host: 'http://localhost:8000',
      path: '/elements/',
      watch: './elements/'
    },
    '/lib/': {
      host: 'http://localhost:8000',
      path: '/lib/',
    },
    '/en/lib/': {
      host: 'http://localhost:8000',
      path: '/lib/',
    },
    '/': {
      host: 'https://www.redhat.com',
      watch: './'
    },
  },
  bs: {
    proxy: {
      target: 'https://www.redhat.com',
      middleware: [
        injectLocalSources,
      ],
    },
  },
};
