import '../elements/Envelope.js';

export default class ADSR extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: .5rem;
                    background-color: #9FA8DA;
                    --line-color: #9FA8DA;
                    --line-width: 2px;
                }
            </style>
            <element-envelope data-envelope width="100" height="25"></element-envelope>
        `;
    }
    static get observedAttributes() {
        return ['a', 'd', 's', 'r', 'width', 'height'];
    }

    connectedCallback() {
        if(!this.hasAttribute('a')) {
            this.setAttribute('a', '100');
        }
        if(!this.hasAttribute('d')) {
            this.setAttribute('d', '100');
        }
        if(!this.hasAttribute('s')) {
            this.setAttribute('s', '50');
        }
        if(!this.hasAttribute('r')) {
            this.setAttribute('r', '100');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const envelopeDisplayElement = this.shadowRoot.querySelector('[data-envelope]');
        switch (name) {
            case 'a':
                envelopeDisplayElement.setAttribute('a', newValue);
                break;
            case 'd':
                envelopeDisplayElement.setAttribute('d', newValue);
                break;
            case 's':
                envelopeDisplayElement.setAttribute('s', newValue);
                break;
            case 'r':
                envelopeDisplayElement.setAttribute('r', newValue);
                break;
            case 'width':
                envelopeDisplayElement.setAttribute('width', newValue);
                break;
            case 'height':
                envelopeDisplayElement.setAttribute('height', newValue);
                break;
        }
    }
}

window.customElements.define('symbol-adsr', ADSR);