const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            padding: 1rem;
            background-color: var(--machine-color);

            --machine-color: #FFAB91;
        }
        h4 {
            margin: 0;
        }
        ul {
            padding: 0;
            list-style: none;
        }
    </style>
    <h4>Gain</h4>
    <ul>
        <li>
            <label>amount</label>
            <input data-amount-range type="range" min="0" max="1" step="0.1" />
            <output data-amount-value><output>
        </li>
    </ul>
`;

export default class Gain extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    static get observedAttributes() { return ['amount', 'min', 'max', 'step']; }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'amount':
                this.shadowRoot.querySelector('[data-amount-range]').value = newValue;
                this.shadowRoot.querySelector('[data-amount-value]').innerHTML = Number(newValue).toFixed(2);
                break;
        }
    }
    connectedCallback() {
        //Amount
        if (!this.hasAttribute('amount')) {
            this.setAttribute('amount', '0.5');
        }
        if (!this.hasAttribute('min')) {
            this.setAttribute('min', '0');
        }
        if (!this.hasAttribute('max')) {
            this.setAttribute('max', '1');
        }
        if (!this.hasAttribute('step')) {
            this.setAttribute('step', '.1');
        }

        const rangeElement = this.shadowRoot.querySelector('[data-amount-range]');
        rangeElement.setAttribute('min', this.getAttribute('min'));
        rangeElement.setAttribute('max', this.getAttribute('max'));
        rangeElement.setAttribute('step', this.getAttribute('step'));
        rangeElement.setAttribute('value', this.getAttribute('amount'));

        rangeElement.addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('amount-change', {detail: Number(event.target.value)}));
            this.setAttribute('amount', event.target.value);
        });
    }
};

window.customElements.define('machine-gain', Gain);