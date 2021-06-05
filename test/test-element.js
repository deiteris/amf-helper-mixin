import { LitElement, html, css } from 'lit-element';
import { AmfHelperMixin } from '../amf-helper-mixin.js';

export class TestElement extends AmfHelperMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      display: block;
    }`;
  }

  render() {
    return html`Test element`;
  }
}
window.customElements.define('test-element', TestElement);
