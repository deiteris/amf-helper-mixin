import {PolymerElement} from '../../../@polymer/polymer/polymer-element.js';
import {AmfHelperMixin} from '../amf-helper-mixin.js';
import {html} from '../../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @appliesMixin AmfHelperMixin
 */
class TestElement extends AmfHelperMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="api-form-styles">
    :host {
      display: block;
    }
    </style>
`;
  }

  static get is() {
    return 'test-element';
  }
}
window.customElements.define(TestElement.is, TestElement);
