var _SuperClippy_instances, _a, _SuperClippy_response, _SuperClippy_connection, _SuperClippy_socket, _SuperClippy_loading, _SuperClippy_waitMessage, _SuperClippy_content, _SuperClippy_showTranslate, _SuperClippy_showImageOptions, _SuperClippy_showCustom, _SuperClippy_promptSelect_get, _SuperClippy_textArea_get, _SuperClippy_languageSelect_get, _SuperClippy_languageTextArea_get, _SuperClippy_imagePrompt_get, _SuperClippy_imageSize_get, _SuperClippy_imageQuality_get, _SuperClippy_requestText, _SuperClippy_requestImage, _SuperClippy_onClick, _SuperClippy_onPromptChange, _SuperClippy_updateResponse;
var SuperClippy_1;
import { __classPrivateFieldGet, __classPrivateFieldSet, __decorate } from "tslib";
/* eslint-disable wc/guard-super-call */
import { html, LitElement } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property } from 'lit/decorators.js';
import "@rhds/elements/rh-spinner/rh-spinner.js";
import "@rhds/elements/rh-button/rh-button.js";
import "@patternfly/elements/pf-clipboard-copy/pf-clipboard-copy.js";
// eslint-disable-next-line import/no-extraneous-dependencies
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import shoelaceStyle from '@shoelace-style/shoelace/dist/themes/dark.css';
import style from './super-clippy.css';
let SuperClippy = SuperClippy_1 = _a = class SuperClippy extends LitElement {
    constructor() {
        super(...arguments);
        _SuperClippy_instances.add(this);
        _SuperClippy_response.set(this, void 0);
        _SuperClippy_connection.set(this, false);
        _SuperClippy_socket.set(this, void 0);
        _SuperClippy_loading.set(this, false);
        _SuperClippy_waitMessage.set(this, 'Loading...');
        /**
         * Representation of the page html textContent as a deduped string
         */
        _SuperClippy_content.set(this, null);
        _SuperClippy_showTranslate.set(this, false);
        _SuperClippy_showImageOptions.set(this, false);
        _SuperClippy_showCustom.set(this, false);
    }
    static stringify(action, content, size, quality) {
        const data = {
            "action": `${action}`,
            "body": `${content}`,
        };
        if (action === 'getImage') {
            data.size = size !== null && size !== void 0 ? size : '';
            data.quality = quality !== null && quality !== void 0 ? quality : '';
        }
        return JSON.stringify(data);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _SuperClippy_socket, new WebSocket("wss://7w4j1v3rz7.execute-api.us-east-1.amazonaws.com/production/"), "f");
        __classPrivateFieldGet(this, _SuperClippy_socket, "f").addEventListener("open", () => {
            __classPrivateFieldSet(this, _SuperClippy_connection, true, "f");
            this.requestUpdate();
            // set interval to keep connection alive
            setInterval(() => {
                var _b;
                if (__classPrivateFieldGet(this, _SuperClippy_connection, "f")) {
                    (_b = __classPrivateFieldGet(this, _SuperClippy_socket, "f")) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({ action: 'ping' }));
                }
            }, 30000);
        });
        __classPrivateFieldGet(this, _SuperClippy_socket, "f").addEventListener("close", (event) => {
            // TODO: handle close of connection, add a reconnect feature?
            console.log('connection closed', event);
        });
        __classPrivateFieldGet(this, _SuperClippy_socket, "f").addEventListener("message", (event) => {
            console.log('message received');
            __classPrivateFieldGet(this, _SuperClippy_instances, "m", _SuperClippy_updateResponse).call(this, event);
        });
    }
    render() {
        var _b;
        return html `
      <sl-drawer label="Hello, how can I help?" class="drawer-overview" ?hidden="${!__classPrivateFieldGet(this, _SuperClippy_connection, "f")}">
        <label for="prompts">I want to...</label>

        <select id="prompts" @change="${__classPrivateFieldGet(this, _SuperClippy_instances, "m", _SuperClippy_onPromptChange)}" ?disabled="${__classPrivateFieldGet(this, _SuperClippy_loading, "f")}">
          <option value="">Select an option</option>
          <option value="Translate the following text into ">Translate content</option>
          <option value="Given the following text, suggest new website meta data, keywords and description that would improve SEO rankings: ">Suggest Metadata</option>
          <option value="Given the taxonomy categories [red hat, open source, open shift], suggest which the following taxonomies the following text content best represents: ">Suggest a Taxonomy</option>
          <option value="Generate a image with the following features: ">Generate an Image</option>
          <option value="">Create my own prompt</option>
        </select>
        <div ?hidden="${!__classPrivateFieldGet(this, _SuperClippy_showTranslate, "f")}">
          <select id="language" ?disabled="${__classPrivateFieldGet(this, _SuperClippy_loading, "f")}">
            <option value="">Select an option</option>
            <option value="Chinese">Chinese</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Spanish">Spanish</option>
          </select>
          <textarea name="languageContent" type="text" id="languageContent" placeholder="Copy page content here to translate" ?disabled="${__classPrivateFieldGet(this, _SuperClippy_loading, "f")}" ></textarea>
        </div>
        <div ?hidden="${!__classPrivateFieldGet(this, _SuperClippy_showImageOptions, "f")}">
          <label for="imagePrompt">Generate an image with the following features:</label>
          <textarea name="imagePrompt" type="text" id="imagePrompt" placeholder="Describe the image you want to generate" ?disabled="${__classPrivateFieldGet(this, _SuperClippy_loading, "f")}" ></textarea>
          <label for="imageSize">Image size</label>
          <select name="imageSize" id="imageSize" ?disabled="${__classPrivateFieldGet(this, _SuperClippy_loading, "f")}">
            <option value="256x256">256x256</option>
            <option value="512x512">512x512</option>
            <option value="1024x1024" selected>1024x1024</option>
            <option value="1024x1792">1024x1792</option>
            <option value="1792x1024">1792x1024</option>
          </select>
          <label for="imageQuality">Image quality</label>
          <select name="imageQuality" id="imageQuality" ?disabled="${__classPrivateFieldGet(this, _SuperClippy_loading, "f")}">
            <option value="standard">Standard</option>
            <option value="hd">High Definition</option>
          </select>
        </div>
        <div ?hidden="${!__classPrivateFieldGet(this, _SuperClippy_showCustom, "f")}">
          <label for="askAnything">Create your own prompt</label>
          <textarea name="askAnything" type="text" id="askAnything" placeholder="Create your own prompt" ?disabled="${__classPrivateFieldGet(this, _SuperClippy_loading, "f") || __classPrivateFieldGet(this, _SuperClippy_showTranslate, "f")}"></textarea>
        </div>
        <rh-button @click="${__classPrivateFieldGet(this, _SuperClippy_instances, "m", _SuperClippy_onClick)}" ?disabled="${__classPrivateFieldGet(this, _SuperClippy_loading, "f")}">${__classPrivateFieldGet(this, _SuperClippy_loading, "f") ? html `<rh-spinner size="sm"></rh-spinner>` : html ``} Send</rh-button>
        <div id="response">
          ${__classPrivateFieldGet(this, _SuperClippy_loading, "f") ? html `<p>${__classPrivateFieldGet(this, _SuperClippy_waitMessage, "f")}</p>` : html ``}
          ${unsafeHTML((_b = __classPrivateFieldGet(this, _SuperClippy_response, "f")) !== null && _b !== void 0 ? _b : '')}
        </div>
      </sl-drawer>
    `;
    }
};
_SuperClippy_response = new WeakMap();
_SuperClippy_connection = new WeakMap();
_SuperClippy_socket = new WeakMap();
_SuperClippy_loading = new WeakMap();
_SuperClippy_waitMessage = new WeakMap();
_SuperClippy_content = new WeakMap();
_SuperClippy_showTranslate = new WeakMap();
_SuperClippy_showImageOptions = new WeakMap();
_SuperClippy_showCustom = new WeakMap();
_SuperClippy_instances = new WeakSet();
_SuperClippy_promptSelect_get = function _SuperClippy_promptSelect_get() {
    var _b;
    return (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#prompts');
};
_SuperClippy_textArea_get = function _SuperClippy_textArea_get() {
    var _b;
    return (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#askAnything');
};
_SuperClippy_languageSelect_get = function _SuperClippy_languageSelect_get() {
    var _b;
    return (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#language');
};
_SuperClippy_languageTextArea_get = function _SuperClippy_languageTextArea_get() {
    var _b;
    return (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#languageContent');
};
_SuperClippy_imagePrompt_get = function _SuperClippy_imagePrompt_get() {
    var _b;
    return (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#imagePrompt');
};
_SuperClippy_imageSize_get = function _SuperClippy_imageSize_get() {
    var _b;
    return (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#imageSize');
};
_SuperClippy_imageQuality_get = function _SuperClippy_imageQuality_get() {
    var _b;
    return (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#imageQuality');
};
_SuperClippy_requestText = async function _SuperClippy_requestText(prompt) {
    var _b;
    if (!__classPrivateFieldGet(this, _SuperClippy_connection, "f")) {
        console.warn('[warn] no connection');
        return;
    }
    if (!prompt || prompt === '') {
        console.warn('[warn] no prompt');
        return;
    }
    __classPrivateFieldSet(this, _SuperClippy_loading, true, "f");
    const data = SuperClippy_1.stringify('sendMessage', prompt);
    (_b = __classPrivateFieldGet(this, _SuperClippy_socket, "f")) === null || _b === void 0 ? void 0 : _b.send(data);
    this.requestUpdate();
};
_SuperClippy_requestImage = async function _SuperClippy_requestImage(prompt, size, quality) {
    var _b;
    if (!__classPrivateFieldGet(this, _SuperClippy_connection, "f")) {
        console.warn('[warn] no connection');
        return;
    }
    if (!prompt || prompt === '') {
        console.warn('[warn] no prompt');
        return;
    }
    __classPrivateFieldSet(this, _SuperClippy_loading, true, "f");
    const data = SuperClippy_1.stringify('getImage', prompt, size, quality);
    console.log(data);
    (_b = __classPrivateFieldGet(this, _SuperClippy_socket, "f")) === null || _b === void 0 ? void 0 : _b.send(data);
    this.requestUpdate();
};
_SuperClippy_onClick = function _SuperClippy_onClick(event) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (!(event instanceof PointerEvent)) {
        return;
    }
    switch ((_b = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_promptSelect_get)) === null || _b === void 0 ? void 0 : _b.selectedIndex) {
        case 0:
            break;
        case 1: {
            __classPrivateFieldGet(this, _SuperClippy_instances, "m", _SuperClippy_requestText).call(this, `${(_c = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_promptSelect_get)) === null || _c === void 0 ? void 0 : _c.value} ${(_d = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_languageSelect_get)) === null || _d === void 0 ? void 0 : _d.value}: ${(_e = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_languageTextArea_get)) === null || _e === void 0 ? void 0 : _e.value}`);
            break;
        }
        case 2:
        case 3:
            if (__classPrivateFieldGet(this, _SuperClippy_content, "f") === null || __classPrivateFieldGet(this, _SuperClippy_content, "f") === '') {
                // TODO: ability to show error messages
                console.log('no content');
                return;
            }
            __classPrivateFieldGet(this, _SuperClippy_instances, "m", _SuperClippy_requestText).call(this, `${(_f = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_promptSelect_get)) === null || _f === void 0 ? void 0 : _f.value} ${__classPrivateFieldGet(this, _SuperClippy_content, "f")}`);
            break;
        case 4:
            console.log('submit image prompt');
            __classPrivateFieldGet(this, _SuperClippy_instances, "m", _SuperClippy_requestImage).call(this, (_g = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_imagePrompt_get)) === null || _g === void 0 ? void 0 : _g.value, (_h = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_imageSize_get)) === null || _h === void 0 ? void 0 : _h.value, (_j = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_imageQuality_get)) === null || _j === void 0 ? void 0 : _j.value);
            break;
        case 5:
            __classPrivateFieldGet(this, _SuperClippy_instances, "m", _SuperClippy_requestText).call(this, (_k = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_textArea_get)) === null || _k === void 0 ? void 0 : _k.value);
            break;
        default:
            break;
    }
};
_SuperClippy_onPromptChange = async function _SuperClippy_onPromptChange() {
    var _b, _c, _d, _e;
    __classPrivateFieldSet(this, _SuperClippy_showTranslate, false, "f");
    __classPrivateFieldSet(this, _SuperClippy_showImageOptions, false, "f");
    __classPrivateFieldSet(this, _SuperClippy_showCustom, false, "f");
    // switch controls with prompt
    switch ((_b = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_promptSelect_get)) === null || _b === void 0 ? void 0 : _b.selectedIndex) {
        case 0:
            this.requestUpdate();
            await this.updateComplete;
            break;
        case 1: {
            __classPrivateFieldSet(this, _SuperClippy_showTranslate, true, "f");
            this.requestUpdate();
            await this.updateComplete;
            (_c = __classPrivateFieldGet(this, _SuperClippy_instances, "a", _SuperClippy_languageSelect_get)) === null || _c === void 0 ? void 0 : _c.focus();
            break;
        }
        case 2:
        case 3: {
            this.requestUpdate();
            await this.updateComplete;
            // get the iframe content
            const iframe = document.querySelector('iframe');
            const page = (_d = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _d === void 0 ? void 0 : _d.document.body.cloneNode(true);
            // filter out elements we dont want to use tokens on
            const filterItems = page === null || page === void 0 ? void 0 : page.querySelectorAll('pfe-navigation, rh-navigation-secondary, rh-footer, script, style, .skip-link, #universal-nav, .pfe-nav-light-dom, form, #footnotes');
            filterItems === null || filterItems === void 0 ? void 0 : filterItems.forEach((item) => item.remove());
            // remove spaces and new lines
            const pageText = (_e = page === null || page === void 0 ? void 0 : page.textContent) === null || _e === void 0 ? void 0 : _e.replace(/^\s+|\s+$/gm, '').replace(/(\r\n|\n|\r)/gm, " ");
            __classPrivateFieldSet(this, _SuperClippy_content, Array.from(new Set(pageText === null || pageText === void 0 ? void 0 : pageText.split(' '))).join(' ').toString(), "f");
            break;
        }
        case 4: {
            __classPrivateFieldSet(this, _SuperClippy_showImageOptions, true, "f");
            this.requestUpdate();
            await this.updateComplete;
            break;
        }
        case 5: {
            __classPrivateFieldSet(this, _SuperClippy_showCustom, true, "f");
            this.requestUpdate();
            await this.updateComplete;
            break;
        }
        default:
            this.requestUpdate();
            await this.updateComplete;
            break;
    }
};
_SuperClippy_updateResponse = function _SuperClippy_updateResponse(response) {
    console.log(response);
    let data;
    try {
        data = JSON.parse(response.data);
        if (Object.keys(data).length === 0 || data.message === '' || data.$metadata) {
            // ignore empty responses
            return;
        }
        if (data.error) {
            console.log('some error', data.error);
            // data.message = data.error;
            return;
        }
    }
    catch (error) {
        console.log('error parsing response', error);
        data = response.data;
    }
    if (data instanceof Array) {
        console.log('data is an array');
        const content = [];
        data.forEach((item) => {
            content.push(`<p>${item.revised_prompt}</p><img src="${item.url}" alt="${item.revised_prompt}" />`);
        });
        __classPrivateFieldSet(this, _SuperClippy_response, content.join(''), "f");
        __classPrivateFieldSet(this, _SuperClippy_loading, false, "f");
    }
    else if (data.message) {
        if (data.message === "Endpoint request timed out") {
            __classPrivateFieldSet(this, _SuperClippy_waitMessage, "The response is taking longer then expected... Please wait", "f");
        }
        else {
            console.log('data message did not time out');
            console.log('what about data.body', data.body);
            __classPrivateFieldSet(this, _SuperClippy_response, data.message, "f");
            __classPrivateFieldSet(this, _SuperClippy_loading, false, "f");
        }
    }
    else {
        console.log('data message did not exist');
        console.log('what about data.body', data.body);
        __classPrivateFieldSet(this, _SuperClippy_response, data, "f");
        __classPrivateFieldSet(this, _SuperClippy_loading, false, "f");
    }
    this.requestUpdate();
};
SuperClippy.styles = [shoelaceStyle, style];
__decorate([
    property()
], SuperClippy.prototype, "endpoint", void 0);
__decorate([
    property()
], SuperClippy.prototype, "apiKey", void 0);
SuperClippy = SuperClippy_1 = __decorate([
    customElement('super-clippy')
], SuperClippy);
export { SuperClippy };
//# sourceMappingURL=super-clippy.js.map