import '../elements/Envelope.js';

export default class Gain extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: .5rem;
                    background-color: var(--machine-color);

                    --machine-color: #FFAB91
                }
            </style>
            <div></div>
        `;
    }
    static get observedAttributes() {
        return ['amount'];
    }

    connectedCallback() {
        if (!this.hasAttribute('amount')) {
            this.setAttribute('amount', '0');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const envelopeDisplayElement = this.shadowRoot.querySelector('div');
        switch (name) {
            case 'amount':
                envelopeDisplayElement.innerHTML = `${Number(newValue).toFixed(2)}`;
        }
    }
}

window.customElements.define('symbol-gain', Gain);