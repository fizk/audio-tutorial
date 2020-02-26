import '../elements/Envelope.js';

export default class Oscillator extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: .5rem;
                    background-color: #1DE9B6;
                    --line-color: #9FA8DA;
                    --line-width: 2px;
                }
            </style>
            <div></div>
        `;
    }
    static get observedAttributes() {
        return ['frequency'];
    }

    connectedCallback() {
        if (!this.hasAttribute('frequency')) {
            this.setAttribute('frequency', '0');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const envelopeDisplayElement = this.shadowRoot.querySelector('div');
        switch (name) {
            case 'frequency':
                envelopeDisplayElement.innerHTML = `${Number(newValue).toFixed(2)} Hz`;
        }
    }
}

window.customElements.define('symbol-oscillator', Oscillator);