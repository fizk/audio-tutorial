import '../elements/Article.js';
import '../pads/FrequencySynth.js';

export default class ModulationFMSynth extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                svg {
                    background-color: var(--screen-background-color);
                }
                figure {
                    text-align: center;
                }
                figcaption {
                    font-size: .8rem;
                }
            </style>


            <element-article>
                <h2 slot="header">FM synth</h2>

                <button data-preset-1>Preset 1</button>
                <button data-preset-2>Preset 2</button>


<button data-ratio-1>1:1 </button>
<button data-ratio-2>1:2 </button>
<button data-ratio-3>1:3 </button>
<button data-ratio-4>1:4 </button>
<button data-ratio-5>1:5 </button>
<button data-ratio-6>1:6 </button>
<button data-ratio-7>1:7 </button>
<button data-ratio-8>1:8 </button>
<button data-ratio-9>1:9</button>


                <input type="range" min="1" max="24" />
                <select>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                </select>
                <pad-frequency-synth slot="aside"></pad-frequency-synth>
                <a href="/modulation/am-synth" slot="footer" rel="prev">AM Synth</a>
                <a href="/modulation/epilogue" slot="footer" rel="next">Epilogue</a>
            </element-article>
        `;
    }

    connectedCallback() {

        this.shadowRoot.querySelector('input').addEventListener('input', (event) => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', event.target.value);
        });

        this.shadowRoot.querySelector('[data-ratio-1]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '1');
        });
        this.shadowRoot.querySelector('[data-ratio-2]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '2');
        });
        this.shadowRoot.querySelector('[data-ratio-3]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '3');
        });
        this.shadowRoot.querySelector('[data-ratio-4]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '4');
        });
        this.shadowRoot.querySelector('[data-ratio-5]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '5');
        });
        this.shadowRoot.querySelector('[data-ratio-6]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '6');
        });
        this.shadowRoot.querySelector('[data-ratio-7]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '7');
        });
        this.shadowRoot.querySelector('[data-ratio-8]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '8');
        });
        this.shadowRoot.querySelector('[data-ratio-9]').addEventListener('click', () => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('index', '9');
        });




        this.shadowRoot.querySelector('[data-preset-1]').addEventListener('click', _ => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('modulator-a', '100');
            padElement.setAttribute('modulator-d', '100');
            padElement.setAttribute('modulator-s', '100');
            padElement.setAttribute('modulator-r', '100');

            padElement.setAttribute('carrier-a', '100');
            padElement.setAttribute('carrier-d', '100');
            padElement.setAttribute('carrier-s', '100');
            padElement.setAttribute('carrier-r', '100');
        });
        this.shadowRoot.querySelector('[data-preset-2]').addEventListener('click', _ => {
            const padElement = this.shadowRoot.querySelector('pad-frequency-synth');
            padElement.setAttribute('modulator-a', '100');
            padElement.setAttribute('modulator-d', '100');
            padElement.setAttribute('modulator-s', '100');
            padElement.setAttribute('modulator-r', '100');

            padElement.setAttribute('carrier-a', '1');
            padElement.setAttribute('carrier-d', '2');
            padElement.setAttribute('carrier-s', '100');
            padElement.setAttribute('carrier-r', '1');
        });
    }
}

window.customElements.define('page-modulation-fm-synth', ModulationFMSynth);