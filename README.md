# \<super-clippy>

Web component to talk to a WebSocket API and an AI chatbot.

## Installation

```bash
npm ci
```

## Dev server

You will need a API Key and Endpoint in order for demo to run

```bash
npm run start
```

## Usage

```html
  <rh-button danger id="trigger">Help</rh-button>
  <super-clippy></super-clippy>

  <script type="module">
    import '../src/super-clippy.js';
    import './addApi.js' /* Javascript that loads in the api key and endpoint */
    import '@rhds/elements/rh-button/rh-button.js';
    import '@rhds/elements/rh-navigation-secondary/rh-navigation-secondary.js';
  </script>

  <script defer>
    const openButton = document.querySelector('rh-button');
    openButton.addEventListener('click', () => {
      const clippy = document.querySelector('super-clippy');
      const drawer = clippy
        .shadowRoot
        .querySelector('sl-drawer');
      drawer.show();
    });
  </script>
```

