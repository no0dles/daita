export class ButtonElement extends HTMLElement {
  protected shadow: ShadowRoot;

  constructor() {
    super();
    const templateEl = document.createElement('template');
    templateEl.innerHTML = require('./button.html');

    this.shadow = this.attachShadow({mode: 'closed'});
    this.shadow.appendChild(templateEl.content.cloneNode(true));
  }
}

window.customElements.define('daita-button', ButtonElement);