import '../elements/Oscilloscope.js';

const template = document.createElement('template');
template.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    background-color: #1DE9B6;
                    padding: 1rem;

                    --oscilloscope-background: #37474F;
                    --oscilloscope-stroke: #1DE9B6;
                    --oscilloscope-width: 4px;
                }
                h4 {
                    margin: 0;
                }
            </style>
            <h4>Oscillator</h4>
            <div data-waves-container>
                <lable>type</label>
                <select data-type>
                    <option value="sine">sine</option>
                    <option value="square">square</option>
                    <option value="sawtooth">sawtooth</option>
                    <option value="triangle">triangle</option>
                </select>
            </div>
            <div>
                <label>frequency</label>
                <input type="range" data-frequency-range min="0" max="880" />
                <span data-frequency-value></span>
            </div>
            <elements-oscilloscope></elements-oscilloscope>

`;

export default class Oscillator extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() { return ['frequency', 'wave']; }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'frequency':
                this.shadowRoot.querySelector('[data-frequency-range]').value = newValue;
                this.shadowRoot.querySelector('[data-frequency-value]').innerHTML = newValue;
                break;
            case 'wave':
                this.shadowRoot.querySelector('[data-type]').value = newValue;
                this.shadowRoot.querySelector('[data-waves-container]').style.display =
                    (newValue === null || newValue === 'none') ? 'none' : 'block';
                break;
        }
    }

    connectedCallback() {
        //Frequency
        if (!this.hasAttribute('frequency') ) {
            this.setAttribute('frequency', '440');
        }

        this.shadowRoot.querySelector('[data-frequency-range]').addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('frequency-change', {
                detail: Number(event.target.value)
            }));
            this.setAttribute('frequency', event.target.value);
        });

        // Wave type
        this.setAttribute('wave', this.hasAttribute('wave') ? this.getAttribute('wave') : 'none');
        this.shadowRoot.querySelector('[data-type]').addEventListener('change', (event) => {
            this.dispatchEvent(new CustomEvent('type-change', {
                detail: event.target.value
            }));
            this.setAttribute('wave', event.target.value);
        });
    }

    set frequencyData(data) {
        this.shadowRoot.querySelector('elements-oscilloscope').data = data;
    }
};

window.customElements.define('machine-oscillator', Oscillator);