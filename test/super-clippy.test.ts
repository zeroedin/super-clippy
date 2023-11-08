import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SuperClippy } from '../src/super-clippy.js';

describe('SuperClippy', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<SuperClippy>(html`<super-clippy></super-clippy>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
