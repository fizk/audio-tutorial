const template = document.createElement('template');
template.innerHTML = `
    <p>
        A <input data-range-a type="range" min="0" max="100" value="100" /><span data-value-a></span>
    </p>
    <p>
        D <input data-range-d type="range" min="0" max="100" value="100" /><span data-value-d></span>
    </p>
    <p>
        S <input data-range-s type="range" min="0" max="100" value="50" /><span data-value-s></span>
    </p>
    <p>
        R <input data-range-r type="range" min="0" max="100" value="100" /><span data-value-r></span>
    </p>
`;
export default class EnvelopeControlls extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() { return ['a', 'd', 's', 'r']; }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'a':
                this.shadowRoot.querySelector('[data-range-a]').value = newValue;
                this.shadowRoot.querySelector('[data-value-a]').innerHTML = newValue;
            break;
            case 'd':
                this.shadowRoot.querySelector('[data-range-d]').value = newValue;
                this.shadowRoot.querySelector('[data-value-d]').innerHTML = newValue;
            break;
            case 's':
                this.shadowRoot.querySelector('[data-range-s]').value = newValue;
                this.shadowRoot.querySelector('[data-value-s]').innerHTML = newValue;
            break;
            case 'r':
                this.shadowRoot.querySelector('[data-range-r]').value = newValue;
                this.shadowRoot.querySelector('[data-value-r]').innerHTML = newValue;
            break;
        }
    }

    connectedCallback() {
        const aRange = this.shadowRoot.querySelector('[data-range-a]');
        const dRange = this.shadowRoot.querySelector('[data-range-d]');
        const sRange = this.shadowRoot.querySelector('[data-range-s]');
        const rRange = this.shadowRoot.querySelector('[data-range-r]');

        if (!this.hasAttribute('a')) {
            this.setAttribute('a', '100');
        }
        if (!this.hasAttribute('d')) {
            this.setAttribute('d', '100');
        }
        if (!this.hasAttribute('s')) {
            this.setAttribute('s', '50');
        }
        if (!this.hasAttribute('r')) {
            this.setAttribute('r', '100');
        }

        aRange.addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('a-change', {
                detail: Number(event.target.value),
                composed: true,
            }));
            this.setAttribute('a', event.target.value);
        });
        dRange.addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('d-change', {
                detail: Number(event.target.value),
                composed: true,
            }));
            this.setAttribute('d', event.target.value);
        });
        sRange.addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('s-change', {
                detail: Number(event.target.value),
                composed: true,
            }));
            this.setAttribute('s', event.target.value);
        });
        rRange.addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('r-change', {
                detail: Number(event.target.value),
                composed: true,
            }));
            this.setAttribute('r', event.target.value);
        });
    }
}

window.customElements.define('elements-envelope-controlls', EnvelopeControlls);