/* eslint-disable wc/guard-super-call */
import { html, LitElement } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property } from 'lit/decorators.js';

import '@rhds/elements/rh-spinner/rh-spinner.js';
import '@rhds/elements/rh-button/rh-button.js';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import shoelaceStyle from './shoe-lace-dark.css';

import style from './super-clippy.css';

export interface WebSocketInterface {
  action: string;
  body: string;
  size?: string;
  quality?: string;
  response_format?: string;
}

@customElement('super-clippy')
export class SuperClippy extends LitElement {
  static readonly styles = [shoelaceStyle, style];

  @property() endpoint?: string;

  @property() apiKey?: string;

  #response: string | undefined;

  #connection = false;

  #socket: WebSocket | undefined;

  #loading = false;

  #waitMessage = 'Loading...';

  /**
   * Representation of the page html textContent as a deduped string
   */
  #content: string | null = null;

  #showTranslate = false;

  #showImageOptions = false;

  #showCustom = false;

  get #promptSelect(): HTMLSelectElement | undefined {
    return this.shadowRoot?.querySelector('#prompts') as
      | HTMLSelectElement
      | undefined;
  }

  get #textArea(): HTMLTextAreaElement | undefined {
    return this.shadowRoot?.querySelector('#askAnything') as
      | HTMLTextAreaElement
      | undefined;
  }

  get #languageSelect(): HTMLSelectElement | undefined {
    return this.shadowRoot?.querySelector('#language') as
      | HTMLSelectElement
      | undefined;
  }

  get #languageTextArea(): HTMLTextAreaElement | undefined {
    return this.shadowRoot?.querySelector('#languageContent') as
      | HTMLTextAreaElement
      | undefined;
  }

  get #imagePrompt(): HTMLTextAreaElement | undefined {
    return this.shadowRoot?.querySelector('#imagePrompt') as
      | HTMLTextAreaElement
      | undefined;
  }

  get #imageSize(): HTMLSelectElement | undefined {
    return this.shadowRoot?.querySelector('#imageSize') as
      | HTMLSelectElement
      | undefined;
  }

  get #imageQuality(): HTMLSelectElement | undefined {
    return this.shadowRoot?.querySelector('#imageQuality') as
      | HTMLSelectElement
      | undefined;
  }

  static stringify(
    action: string,
    content: string,
    size?: string,
    quality?: string
  ): string {
    const data: WebSocketInterface = {
      action: `${action}`,
      body: `${content}`,
    };
    if (action === 'getImage') {
      data.size = size ?? '';
      data.quality = quality ?? '';
    }
    return JSON.stringify(data);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#socket = new WebSocket(
      'wss://7w4j1v3rz7.execute-api.us-east-1.amazonaws.com/production/'
    );

    this.#socket.addEventListener('open', () => {
      this.#connection = true;
      this.requestUpdate();
      // set interval to keep connection alive
      setInterval(() => {
        if (this.#connection) {
          this.#socket?.send(JSON.stringify({ action: 'ping' }));
        }
      }, 30000);
    });

    this.#socket.addEventListener('close', event => {
      // TODO: handle close of connection, add a reconnect feature?
      console.log('connection closed', event);
    });

    this.#socket.addEventListener('message', event => {
      console.log('message received');
      this.#updateResponse(event);
    });
  }

  render() {
    return html`
      <rh-button @click="${this.#togglePanel}" danger id="trigger"
        >Help</rh-button
      >
      <sl-drawer
        label="Hello, how can I help?"
        class="drawer-overview"
        ?hidden="${!this.#connection}"
      >
        <label for="prompts">I want to...</label>

        <select
          id="prompts"
          @change="${this.#onPromptChange}"
          ?disabled="${this.#loading}"
        >
          <option value="">Select an option</option>
          <option value="Translate the following text into ">
            Translate content
          </option>
          <option
            value="Given the following text, suggest new website meta data, keywords and description that would improve SEO rankings: "
          >
            Suggest Metadata
          </option>
          <option
            value="Given the taxonomy categories [AI/ML,APIs,Application modernization,Automation,Big data,Cloud,Cloud services,Communities,Consulting,Containers,Culture,Customer success,Development,DevOps,Digital transformation,Edge computing,Emerging technology,Events,Integration,IoT,Kubernetes,Linux,Management,Microservices,Migration,NFV,Open hybrid cloud,Open source,Open source communities,OpenStack,Operations,Partners,Process,Process automation,Quarkus,SAP workloads,Security,Storage,Training,Virtualization], please return a maximum of 4 terms as a comma separated list of the topics this text best represents: "
          >
            Suggest a Taxonomy
          </option>
          <option value="Generate an image with the following features: illustration, vector, red, teal, ">
            Generate an Image
          </option>
          <option value="">Create my own prompt</option>
        </select>
        <div ?hidden="${!this.#showTranslate}">
          <select id="language" ?disabled="${this.#loading}">
            <option value="">Select an option</option>
            <option value="Chinese">Chinese</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Spanish">Spanish</option>
          </select>
          <textarea
            name="languageContent"
            type="text"
            id="languageContent"
            placeholder="Copy page content here to translate"
            ?disabled="${this.#loading}"
          ></textarea>
        </div>
        <div ?hidden="${!this.#showImageOptions}">
          <label for="imagePrompt"
            >Generate an image with the following features: illustration, vector, red, teal, </label
          >
          <textarea
            name="imagePrompt"
            type="text"
            id="imagePrompt"
            placeholder="Describe the image you want to generate"
            ?disabled="${this.#loading}"
          ></textarea>
          <label for="imageSize">Image size</label>
          <select name="imageSize" id="imageSize" ?disabled="${this.#loading}">
            <option value="256x256">256x256</option>
            <option value="512x512">512x512</option>
            <option value="1024x1024" selected>1024x1024</option>
            <option value="1024x1792">1024x1792</option>
            <option value="1792x1024">1792x1024</option>
          </select>
          <label for="imageQuality">Image quality</label>
          <select
            name="imageQuality"
            id="imageQuality"
            ?disabled="${this.#loading}"
          >
            <option value="standard">Standard</option>
            <option value="hd">High Definition</option>
          </select>
        </div>
        <div ?hidden="${!this.#showCustom}">
          <label for="askAnything">Create your own prompt</label>
          <textarea
            name="askAnything"
            type="text"
            id="askAnything"
            placeholder="Create your own prompt"
            ?disabled="${this.#loading || this.#showTranslate}"
          ></textarea>
        </div>
        <rh-button @click="${this.#onClick}" ?disabled="${this.#loading}"
          >${this.#loading ? html`<rh-spinner size="sm"></rh-spinner>` : html``}
          Send</rh-button
        >
        <div id="response">
          ${this.#loading ? html`<p>${this.#waitMessage}</p>` : html``}
          ${unsafeHTML(this.#response ?? '')}
        </div>
      </sl-drawer>
    `;
  }

  async #requestText(prompt?: string) {
    if (!this.#connection) {
      console.warn('[warn] no connection');
      return;
    }

    if (!prompt || prompt === '') {
      console.warn('[warn] no prompt');
      return;
    }

    this.#loading = true;
    const data = SuperClippy.stringify('sendMessage', prompt);
    this.#socket?.send(data);
    this.requestUpdate();
  }

  async #requestImage(prompt?: string, size?: string, quality?: string) {

    if (!this.#connection) {
      console.warn('[warn] no connection');
      return;
    }
    if (!prompt || prompt === '') {
      console.warn('[warn] no prompt');
      return;
    }

    this.#loading = true;
    const data = SuperClippy.stringify('getImage', prompt, size, quality);
    console.log(data);
    this.#socket?.send(data);
    this.requestUpdate();
  }

  #onClick() {
    switch (this.#promptSelect?.selectedIndex) {
      case 0:
        break;
      case 1: {
        this.#requestText(
          `${this.#promptSelect?.value} ${this.#languageSelect?.value}: ${
            this.#languageTextArea?.value
          }`
        );
        break;
      }
      case 2:
      case 3:
        if (this.#content === null || this.#content === '') {
          // TODO: ability to show error messages
          console.log('[warn] no prompt given');
          return;
        }
        this.#requestText(`${this.#promptSelect?.value} ${this.#content}`);
        break;
      case 4:
        this.#requestImage(
          this.#imagePrompt?.value,
          this.#imageSize?.value,
          this.#imageQuality?.value
        );
        break;
      case 5:
        this.#requestText(this.#textArea?.value);
        break;
      default:
        break;
    }
  }

  async #onPromptChange() {
    this.#showTranslate = false;
    this.#showImageOptions = false;
    this.#showCustom = false;

    // switch controls with prompt
    switch (this.#promptSelect?.selectedIndex) {
      case 0:
        this.requestUpdate();
        await this.updateComplete;
        break;
      case 1: {
        this.#showTranslate = true;
        this.requestUpdate();
        await this.updateComplete;
        this.#languageSelect?.focus();
        break;
      }
      case 2:
      case 3: {
        this.requestUpdate();
        await this.updateComplete;
        // get the iframe content
        const iframe = document.querySelector('iframe');
        const page = iframe?.contentWindow?.document.body.cloneNode(
          true
        ) as HTMLElement;
        // filter out elements we dont want to use tokens on
        const filterItems = page?.querySelectorAll(
          'pfe-navigation, rh-navigation-secondary, rh-footer, script, style, .skip-link, #universal-nav, .pfe-nav-light-dom, form, #footnotes'
        );
        filterItems?.forEach(item => item.remove());
        // remove spaces and new lines
        const pageText = page?.textContent
          ?.replace(/^\s+|\s+$/gm, '')
          .replace(/(\r\n|\n|\r)/gm, ' ');
        this.#content = Array.from(new Set(pageText?.split(' ')))
          .join(' ')
          .toString();
        break;
      }
      case 4: {
        this.#showImageOptions = true;
        this.requestUpdate();
        await this.updateComplete;
        break;
      }
      case 5: {
        this.#showCustom = true;
        this.requestUpdate();
        await this.updateComplete;
        break;
      }
      default:
        this.requestUpdate();
        await this.updateComplete;
        break;
    }
  }

  #updateResponse(response: MessageEvent) {
    console.log(response);
    let data;
    try {
      data = JSON.parse(response.data);
      if (
        Object.keys(data).length === 0 ||
        data.message === '' ||
        data.$metadata
      ) {
        // ignore empty responses
        return;
      }
      if (data.error) {
        console.log('some error', data.error);
        // data.message = data.error;
        return;
      }
    } catch (error) {
      console.log('error parsing response', error);
      data = response.data;
    }

    if (data instanceof Array) {
      console.log('data is an array');
      const content: string[] = [];
      data.forEach(item => {
        content.push(
          `<p>${item.revised_prompt}</p><img src="${item.url}" alt="${item.revised_prompt}" />`
        );
      });
      this.#response = content.join('');
      this.#loading = false;
    } else if (data.message) {
      if (data.message === 'Endpoint request timed out') {
        this.#waitMessage =
          'The response is taking longer then expected... Please wait';
      } else {
        this.#response = data.message;
        this.#loading = false;
      }
    } else {
      this.#response = data;
      this.#loading = false;
    }
    this.requestUpdate();
  }

  #togglePanel() {
    const drawer = this.shadowRoot?.querySelector('sl-drawer');
    drawer?.show();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'super-clippy': SuperClippy;
  }
}
